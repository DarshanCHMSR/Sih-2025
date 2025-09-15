#!/usr/bin/env python3
"""
Quick OCR test to see exact structure
"""

from paddlex import create_pipeline

def test_ocr():
    ocr = create_pipeline(pipeline="OCR")
    results_gen = ocr.predict("./sample_marks_cards/1.png")
    results = list(results_gen)
    
    if results:
        result = results[0]
        print(f"Type: {type(result)}")
        print(f"Has rec_texts: {hasattr(result, 'rec_texts')}")
        print(f"Has rec_scores: {hasattr(result, 'rec_scores')}")
        
        # Check if it has different attributes
        attrs = [attr for attr in dir(result) if not attr.startswith('_') and not callable(getattr(result, attr))]
        print(f"Non-callable attributes: {attrs}")
        
        # Check available attributes
        for attr in ['img', 'json', 'str']:
            if hasattr(result, attr):
                value = getattr(result, attr)
                print(f"{attr}: type={type(value)}")
                if attr == 'json':
                    print(f"json keys: {value.keys() if hasattr(value, 'keys') else 'N/A'}")
                elif attr == 'str':
                    print(f"str value: {value[:200] if isinstance(value, str) else value}")
        
        # Try accessing as dict or list
        print(f"Result as dict: {result.__dict__ if hasattr(result, '__dict__') else 'N/A'}")
        
        # Try calling common methods
        for method in ['to_dict', 'get_data', '__getitem__']:
            if hasattr(result, method):
                try:
                    value = getattr(result, method)
                    if callable(value):
                        print(f"{method}(): {value()}")
                    else:
                        print(f"{method}: {value}")
                except Exception as e:
                    print(f"{method}: Error - {e}")

if __name__ == "__main__":
    test_ocr()