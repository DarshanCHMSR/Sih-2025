#!/usr/bin/env python3
"""
Fixed OCR Marks Card Extractor
==============================
Simplified version that works with the latest PaddleOCR
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleMarksCardOCR:
    """Simplified OCR extractor for marks cards."""
    
    def __init__(self, confidence_threshold: float = 0.5):
        """Initialize the OCR extractor."""
        self.confidence_threshold = confidence_threshold
        
        try:
            from paddleocr import PaddleOCR
            self.ocr = PaddleOCR(lang='en')
            logger.info("PaddleOCR initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            raise
    
    def extract_text(self, image_path: str) -> List[Dict[str, Any]]:
        """Extract text from image using PaddleOCR."""
        try:
            logger.info(f"Processing image: {image_path}")
            
            # Perform OCR using the new predict method
            results_generator = self.ocr.predict(image_path)
            results = list(results_generator)
            
            if not results:
                logger.warning("No text detected")
                return []
            
            # Extract text and scores from PaddleOCR results
            result = results[0]
            extracted_text = []
            
            logger.info(f"Result type: {type(result)}")
            
            # Handle the new PaddleOCR structure with OCRResult object
            def find_rec_data(obj, depth=0):
                """Recursively search for rec_texts and rec_scores in nested structure."""
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
            
            try:
                # Find the data containing rec_texts and rec_scores
                result_data = find_rec_data(result)
                
                if result_data and 'rec_texts' in result_data:
                    texts = result_data['rec_texts']
                    scores = result_data['rec_scores']
                    
                    logger.info(f"Found {len(texts)} texts with {len(scores)} scores")
                    
                    for text, confidence in zip(texts, scores):
                        if confidence >= self.confidence_threshold:
                            extracted_text.append({
                                'text': str(text).strip(),
                                'confidence': float(confidence)
                            })
                else:
                    logger.error("Could not find rec_texts and rec_scores in the result")
                    return None
                    
            except Exception as e:
                logger.error(f"Error extracting text from OCRResult: {e}")
                return None
            
            logger.info(f"Extracted {len(extracted_text)} text elements")
            return extracted_text
            
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            raise
    
    def process_marks_card(self, image_path: str, output_path: Optional[str] = None) -> Dict[str, Any]:
        """Process marks card and extract structured data."""
        
        # Extract raw text
        extracted_text = self.extract_text(image_path)
        
        if not extracted_text:
            raise ValueError("No text could be extracted from the image")
        
        # Create structured output
        result = {
            'input_image': str(Path(image_path).name),
            'timestamp': datetime.now().isoformat(),
            'total_elements': len(extracted_text),
            'extracted_text': extracted_text,
            'structured_data': self._extract_marks_data(extracted_text)
        }
        
        # Save if output path provided
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            logger.info(f"Results saved to: {output_path}")
        
        return result
    
    def _extract_marks_data(self, extracted_text: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract structured data from text elements."""
        
        # Combine all text for processing
        all_text = ' '.join([item['text'] for item in extracted_text])
        text_lines = [item['text'] for item in extracted_text]
        
        structured = {
            'student_info': {},
            'marks': [],
            'summary': {},
            'all_text_combined': all_text
        }
        
        # Extract key information using simple patterns
        import re
        
        # Look for student name, roll number, etc.
        for line in text_lines:
            line_lower = line.lower()
            
            # Student name patterns
            if any(keyword in line_lower for keyword in ['name', 'student']):
                if ':' in line:
                    parts = line.split(':')
                    if len(parts) > 1:
                        structured['student_info']['name'] = parts[1].strip()
            
            # Roll number patterns  
            if any(keyword in line_lower for keyword in ['roll', 'reg']):
                # Look for numbers in the line
                numbers = re.findall(r'\d+', line)
                if numbers:
                    structured['student_info']['roll_number'] = numbers[-1]
            
            # Look for marks (number patterns)
            if re.search(r'\d+', line) and any(word in line_lower for word in ['marks', 'total', 'score']):
                numbers = re.findall(r'\d+', line)
                if numbers:
                    structured['marks'].append({
                        'line': line,
                        'numbers': numbers
                    })
        
        return structured

def main():
    """Main function for command line usage."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Simple OCR Marks Card Extractor')
    parser.add_argument('image_path', help='Path to marks card image')
    parser.add_argument('-o', '--output', help='Output JSON file path')
    parser.add_argument('-c', '--confidence', type=float, default=0.5, help='Confidence threshold')
    
    args = parser.parse_args()
    
    try:
        # Initialize extractor
        extractor = SimpleMarksCardOCR(confidence_threshold=args.confidence)
        
        # Process marks card
        result = extractor.process_marks_card(args.image_path, args.output)
        
        # Print summary
        print("\n" + "="*60)
        print("MARKS CARD OCR RESULTS")
        print("="*60)
        print(f"Input Image: {result['input_image']}")
        print(f"Total Text Elements: {result['total_elements']}")
        
        if result['structured_data']['student_info']:
            print("\nStudent Information:")
            for key, value in result['structured_data']['student_info'].items():
                print(f"  {key.replace('_', ' ').title()}: {value}")
        
        if result['structured_data']['marks']:
            print("\nMarks-related Text:")
            for item in result['structured_data']['marks'][:5]:  # Show first 5
                print(f"  {item['line']}")
        
        print("\nFirst 10 Extracted Text Elements:")
        for i, item in enumerate(result['extracted_text'][:10], 1):
            print(f"  {i:2}. {item['text']:<40} (confidence: {item['confidence']:.3f})")
        
        if result['total_elements'] > 10:
            print(f"  ... and {result['total_elements'] - 10} more elements")
        
        print("\n" + "="*60)
        
    except Exception as e:
        logger.error(f"Application error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()