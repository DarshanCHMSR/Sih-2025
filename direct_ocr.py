#!/usr/bin/env python3
"""
Direct OCR access based on observed structure
"""

import json
import logging
from paddlex import create_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_marks_card_text(image_path: str, output_file: str = "results.json"):
    """Extract text from marks card using PaddleOCR."""
    
    logger.info("Initializing OCR...")
    ocr = create_pipeline(pipeline="OCR")
    
    logger.info(f"Processing: {image_path}")
    results_gen = ocr.predict(image_path)
    results = list(results_gen)
    
    if not results:
        print("No results found")
        return
    
    result = results[0]
    
    # From the debug output, I can see the result contains a large dictionary
    # with 'rec_texts' and 'rec_scores' keys. Let me access it directly.
    
    logger.info(f"Result type: {type(result)}")
    
    # The debug output showed the data is directly accessible from the result object
    # Extract the data from the internal structure
    result_data = None
    
    # Try various ways to access the internal data
    if hasattr(result, '__dict__'):
        result_dict = result.__dict__
        
        # Look for data containing rec_texts
        for key, value in result_dict.items():
            if isinstance(value, dict) and 'rec_texts' in value:
                result_data = value
                break
    
    if not result_data:
        # From the debug, it looked like the data might be directly in the object
        # Try to access known attributes
        try:
            # The debug output showed these attributes exist in the structure
            # Let's look for them in any nested dictionaries
            def find_rec_data(obj, depth=0):
                if depth > 3:  # Avoid infinite recursion
                    return None
                    
                if isinstance(obj, dict):
                    if 'rec_texts' in obj and 'rec_scores' in obj:
                        return obj
                    
                    for value in obj.values():
                        found = find_rec_data(value, depth + 1)
                        if found:
                            return found
                elif hasattr(obj, '__dict__'):
                    return find_rec_data(obj.__dict__, depth + 1)
                
                return None
            
            result_data = find_rec_data(result)
            
        except Exception as e:
            logger.error(f"Error searching for data: {e}")
    
    if result_data and 'rec_texts' in result_data:
        texts = result_data['rec_texts']
        scores = result_data['rec_scores']
        
        logger.info(f"Found {len(texts)} text elements")
        
        # Extract high-confidence text
        extracted = []
        for text, score in zip(texts, scores):
            if score >= 0.5:  # Confidence threshold
                extracted.append({
                    'text': text,
                    'confidence': score
                })
        
        # Save results
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'total_extracted': len(extracted),
                'items': extracted
            }, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Extracted {len(extracted)} text elements")
        print(f"📄 Saved to: {output_file}")
        
        # Show sample
        print("\n📝 Sample text:")
        for item in extracted[:10]:
            print(f"  • {item['text']} ({item['confidence']:.3f})")
            
    else:
        print("❌ Could not find text data in result")
        
        # Debug: show what we have
        print("Available data:")
        if hasattr(result, '__dict__'):
            for key in result.__dict__.keys():
                print(f"  - {key}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python direct_ocr.py <image_path>")
        sys.exit(1)
    
    extract_marks_card_text(sys.argv[1])