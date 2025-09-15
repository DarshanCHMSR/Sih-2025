#!/usr/bin/env python3
"""
Simple OCR Test Script
======================
Test PaddleOCR functionality and debug result structure
"""

import sys
import logging
from pathlib import Path

# Configure simple logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_paddleocr_simple():
    """Test basic PaddleOCR functionality."""
    try:
        from paddleocr import PaddleOCR
        
        # Initialize with minimal parameters
        logger.info("Initializing PaddleOCR...")
        ocr = PaddleOCR(lang='en')
        logger.info("PaddleOCR initialized successfully")
        
        # Test with sample image if available
        sample_dir = Path("sample_marks_cards")
        image_files = list(sample_dir.glob("*.png")) + list(sample_dir.glob("*.jpg"))
        
        logger.info(f"Found {len(image_files)} images in sample_marks_cards/")
        
        if not image_files:
            logger.warning("No test images found in sample_marks_cards/")
            return
        
        test_image = image_files[0]
        logger.info(f"Testing with image: {test_image}")
        
        # Perform OCR using the recommended method
        try:
            results = ocr.ocr(str(test_image))
        except:
            # Fallback to predict if ocr method fails
            results = ocr.predict(str(test_image))
        
        # Analyze results structure
        logger.info(f"Results type: {type(results)}")
        logger.info(f"Results length: {len(results) if hasattr(results, '__len__') else 'N/A'}")
        
        if results:
            if hasattr(results, '__getitem__'):
                try:
                    first_result = results[0]
                    logger.info(f"First result type: {type(first_result)}")
                    logger.info(f"First result: {first_result}")
                    
                    if hasattr(first_result, '__len__') and hasattr(first_result, '__getitem__'):
                        logger.info(f"First result length: {len(first_result)}")
                        
                        # Show first few items safely
                        for i in range(min(3, len(first_result))):
                            item = first_result[i]
                            logger.info(f"Item {i}: {item}")
                            logger.info(f"Item {i} type: {type(item)}")
                except Exception as e:
                    logger.info(f"Could not access results[0]: {e}")
            
            # Try to print raw results for debugging
            logger.info(f"Raw results (first 500 chars): {str(results)[:500]}")
        
        return results
        
    except Exception as e:
        logger.error(f"Error in OCR test: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """Run the test."""
    print("🧪 TESTING PADDLEOCR FUNCTIONALITY")
    print("=" * 50)
    
    results = test_paddleocr_simple()
    
    if results:
        print("\n✅ OCR test completed successfully!")
        print("Check the logs above for result structure details.")
    else:
        print("\n❌ OCR test failed!")
        print("Check the error messages above.")

if __name__ == "__main__":
    main()