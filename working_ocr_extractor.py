#!/usr/bin/env python3
"""
Working OCR extractor based on observed PaddleOCR structure
"""

import os
import json
import logging
from typing import List, Dict, Any
from paddlex import create_pipeline

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WorkingOCRExtractor:
    def __init__(self, confidence_threshold: float = 0.5):
        """Initialize OCR extractor with PaddleX."""
        self.confidence_threshold = confidence_threshold
        logger.info("Initializing PaddleOCR...")
        
        try:
            self.ocr = create_pipeline(pipeline="OCR")
            logger.info("PaddleOCR initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            raise
    
    def extract_text(self, image_path: str) -> List[Dict[str, Any]]:
        """Extract text from image using PaddleOCR."""
        try:
            logger.info(f"Processing image: {image_path}")
            
            # Perform OCR
            results_generator = self.ocr.predict(image_path)
            results = list(results_generator)
            
            if not results:
                logger.warning("No text detected")
                return []
            
            # Get the first result
            result = results[0]
            extracted_text = []
            
            logger.info(f"Result type: {type(result)}")
            
            # From the debug output, I know the structure contains the data we need
            # Let's directly access the internal data structure
            try:
                # The result object contains the data in its internal structure
                # Based on the debug output, it should have the attributes directly accessible
                
                # Try to convert to string and parse, or access internal data
                if hasattr(result, '_result_dict') or hasattr(result, '_data'):
                    # Try internal data attributes
                    data = getattr(result, '_result_dict', getattr(result, '_data', None))
                    if data and isinstance(data, dict):
                        texts = data.get('rec_texts', [])
                        scores = data.get('rec_scores', [])
                elif hasattr(result, '__dict__'):
                    # Check if the data is in the object's dictionary
                    result_dict = result.__dict__
                    logger.info(f"Result dict keys: {list(result_dict.keys())}")
                    
                    # Look for nested data structures
                    for key, value in result_dict.items():
                        if isinstance(value, dict) and ('rec_texts' in value or 'rec_texts' in str(value)):
                            texts = value.get('rec_texts', [])
                            scores = value.get('rec_scores', [])
                            break
                    else:
                        # Try direct access from the result as shown in debug
                        texts = []
                        scores = []
                        
                        # From the debug output, we know the data exists
                        # Let's try to find it by examining all attributes
                        for attr_name in dir(result):
                            if not attr_name.startswith('_') and not callable(getattr(result, attr_name, None)):
                                try:
                                    attr_value = getattr(result, attr_name)
                                    logger.info(f"Checking attribute {attr_name}: {type(attr_value)}")
                                    
                                    if isinstance(attr_value, dict):
                                        if 'rec_texts' in attr_value:
                                            texts = attr_value['rec_texts']
                                            scores = attr_value.get('rec_scores', [])
                                            logger.info(f"Found data in {attr_name}")
                                            break
                                        elif hasattr(attr_value, 'keys'):
                                            logger.info(f"Dict keys in {attr_name}: {list(attr_value.keys())}")
                                except Exception as e:
                                    logger.debug(f"Error accessing {attr_name}: {e}")
                
                if not texts:
                    # Last resort: try to access the data we saw in the debug output
                    # The debug showed that the result object itself contains the data
                    logger.info("Trying alternative access methods...")
                    
                    # Check if we can access it like a dict
                    try:
                        if hasattr(result, '__getitem__'):
                            texts = result['rec_texts']
                            scores = result['rec_scores']
                    except:
                        pass
                
                if texts and scores:
                    logger.info(f"Successfully found {len(texts)} texts with {len(scores)} scores")
                    
                    for i, (text, confidence) in enumerate(zip(texts, scores)):
                        if confidence >= self.confidence_threshold:
                            extracted_text.append({
                                'text': str(text).strip(),
                                'confidence': float(confidence),
                                'index': i
                            })
                            logger.debug(f"Extracted: {text} (confidence: {confidence})")
                else:
                    logger.error("Could not locate rec_texts and rec_scores in result structure")
                    logger.info("Attempting to show result structure for debugging...")
                    
                    # Show what we can access
                    try:
                        attrs = [attr for attr in dir(result) if not attr.startswith('_')]
                        logger.info(f"Available attributes: {attrs}")
                        
                        for attr in attrs[:5]:  # Show first few
                            try:
                                value = getattr(result, attr)
                                logger.info(f"{attr}: {type(value)} = {str(value)[:100]}")
                            except:
                                pass
                    except:
                        pass
                        
                    return []
                        
            except Exception as e:
                logger.error(f"Error processing OCR result: {e}")
                return []
            
            logger.info(f"Successfully extracted {len(extracted_text)} text elements")
            return extracted_text
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return []
    
    def save_results(self, extracted_text: List[Dict[str, Any]], output_path: str):
        """Save extracted text to JSON file."""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'extracted_text': extracted_text,
                    'total_items': len(extracted_text),
                    'confidence_threshold': self.confidence_threshold
                }, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Results saved to {output_path}")
            
        except Exception as e:
            logger.error(f"Failed to save results: {e}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='OCR Text Extractor using PaddleOCR')
    parser.add_argument('image_path', help='Path to the image file')
    parser.add_argument('-o', '--output', default='ocr_results.json', help='Output JSON file path')
    parser.add_argument('-c', '--confidence', type=float, default=0.5, help='Confidence threshold')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.image_path):
        print(f"Error: Image file '{args.image_path}' not found")
        return
    
    try:
        # Initialize extractor
        extractor = WorkingOCRExtractor(confidence_threshold=args.confidence)
        
        # Extract text
        extracted_text = extractor.extract_text(args.image_path)
        
        if extracted_text:
            # Save results
            extractor.save_results(extracted_text, args.output)
            
            print(f"✅ Successfully extracted {len(extracted_text)} text elements")
            print(f"📄 Results saved to: {args.output}")
            
            # Show first few results
            print("\n📝 Sample extracted text:")
            for item in extracted_text[:5]:
                print(f"  • {item['text']} (confidence: {item['confidence']:.3f})")
        else:
            print("❌ No text could be extracted from the image")
            
    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()