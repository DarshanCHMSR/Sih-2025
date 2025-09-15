#!/usr/bin/env python3
"""
Simple OCR Debug Script
"""

import sys
import json

def main():
    if len(sys.argv) != 2:
        print("Usage: python simple_ocr.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        from paddleocr import PaddleOCR
        
        print(f"Initializing PaddleOCR...")
        ocr = PaddleOCR(lang='en')
        
        print(f"Processing image: {image_path}")
        
        # Try the ocr method
        try:
            print("Trying ocr() method...")
            results = ocr.ocr(image_path)
            print(f"OCR method succeeded!")
            print(f"Results type: {type(results)}")
            print(f"Results: {results}")
        except Exception as e:
            print(f"OCR method failed: {e}")
            
            try:
                print("Trying predict() method...")
                results = ocr.predict(image_path)
                print(f"Predict method succeeded!")
                print(f"Results type: {type(results)}")
                print(f"Results: {results}")
            except Exception as e2:
                print(f"Predict method also failed: {e2}")
                return
        
        # Try to extract text in simple way
        print("\nTrying to extract text...")
        
        if results:
            print(f"Results is not empty")
            
            # Different ways to handle results
            if isinstance(results, list):
                print(f"Results is a list with {len(results)} items")
                
                if len(results) > 0:
                    first_item = results[0]
                    print(f"First item type: {type(first_item)}")
                    print(f"First item: {first_item}")
                    
                    if isinstance(first_item, list):
                        print(f"First item is a list with {len(first_item)} sub-items")
                        
                        for i, sub_item in enumerate(first_item):
                            print(f"  Sub-item {i} type: {type(sub_item)}")
                            print(f"  Sub-item {i}: {sub_item}")
                            
                            if i >= 2:  # Limit output
                                break
            
            else:
                print(f"Results is not a list: {type(results)}")
                print(f"Results content: {results}")
        
        else:
            print("No results returned")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()