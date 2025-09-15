#!/usr/bin/env python3
"""
Debug OCR Result Structure - Simple script to understand PaddleOCR result format
"""

import os
import sys
from paddlex import create_pipeline

def debug_ocr_structure():
    """Debug the actual OCR result structure"""
    
    # Initialize OCR pipeline
    print("Initializing OCR pipeline...")
    ocr = create_pipeline(pipeline="OCR")
    
    # Test image
    image_path = "./sample_marks_cards/1.png"
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return
    
    print(f"Processing image: {image_path}")
    
    # Get results
    results_generator = ocr.predict(image_path)
    
    print(f"\nResults generator type: {type(results_generator)}")
    
    # Convert generator to list
    results = list(results_generator)
    
    print(f"Results list type: {type(results)}")
    print(f"Number of results: {len(results)}")
    
    if results:
        result = results[0]
        print(f"\nFirst result type: {type(result)}")
        print(f"First result module: {result.__class__.__module__}")
        
        # Print all attributes
        print(f"\nAll attributes:")
        for attr in dir(result):
            if not attr.startswith('_'):
                try:
                    value = getattr(result, attr)
                    if not callable(value):
                        print(f"  {attr}: {type(value)} = {value}")
                except Exception as e:
                    print(f"  {attr}: Error - {e}")
        
        # Try common methods
        print(f"\nTrying common methods:")
        for method_name in ['get_text', 'get_texts', 'texts', 'to_dict', '__dict__']:
            if hasattr(result, method_name):
                try:
                    value = getattr(result, method_name)
                    if callable(value):
                        print(f"  {method_name}(): {value()}")
                    else:
                        print(f"  {method_name}: {value}")
                except Exception as e:
                    print(f"  {method_name}: Error - {e}")
    
if __name__ == "__main__":
    debug_ocr_structure()