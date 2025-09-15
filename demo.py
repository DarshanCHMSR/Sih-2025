#!/usr/bin/env python3
"""
Demo Script for OCR Marks Card Extractor
========================================
This script demonstrates how to use the OCR extractor for marks cards.
It includes examples for different usage scenarios.
"""

import os
import sys
import json
from pathlib import Path
from ocr_extractor import MarksCardOCRExtractor

def demo_basic_extraction(image_path: str):
    """
    Demonstrate basic OCR extraction from a marks card.
    
    Args:
        image_path: Path to the marks card image
    """
    print("\n" + "="*60)
    print("DEMO 1: BASIC OCR EXTRACTION")
    print("="*60)
    
    try:
        # Initialize the OCR extractor
        print("Initializing OCR extractor...")
        extractor = MarksCardOCRExtractor(
            lang='en',
            use_gpu=False,  # Set to True if you have GPU support
            confidence_threshold=0.5
        )
        
        # Extract text from the image
        print(f"Processing image: {image_path}")
        extracted_text = extractor.extract_text(image_path)
        
        print(f"\nFound {len(extracted_text)} text elements:")
        for i, item in enumerate(extracted_text[:10], 1):  # Show first 10 items
            print(f"  {i:2}. {item['text']:<30} (confidence: {item['confidence']:.3f})")
        
        if len(extracted_text) > 10:
            print(f"  ... and {len(extracted_text) - 10} more items")
            
    except Exception as e:
        print(f"Error in basic extraction: {str(e)}")

def demo_structured_extraction(image_path: str):
    """
    Demonstrate structured field extraction from marks card.
    
    Args:
        image_path: Path to the marks card image
    """
    print("\n" + "="*60)
    print("DEMO 2: STRUCTURED FIELD EXTRACTION")
    print("="*60)
    
    try:
        # Initialize extractor
        extractor = MarksCardOCRExtractor()
        
        # Process the entire marks card
        print("Processing marks card for structured data...")
        marks_data = extractor.process_marks_card(image_path)
        
        # Display results in a formatted way
        print("\n📋 EXTRACTED MARKS CARD DATA:")
        print("-" * 40)
        
        # Student Information
        if marks_data.get('student_info'):
            print("\n👤 STUDENT INFORMATION:")
            for key, value in marks_data['student_info'].items():
                print(f"   {key.replace('_', ' ').title()}: {value}")
        
        # Academic Information
        if marks_data.get('academic_info'):
            print("\n🎓 ACADEMIC INFORMATION:")
            for key, value in marks_data['academic_info'].items():
                print(f"   {key.replace('_', ' ').title()}: {value}")
        
        # Subject-wise Marks
        if marks_data.get('subjects_marks'):
            print("\n📚 SUBJECT-WISE MARKS:")
            for subject, marks in marks_data['subjects_marks'].items():
                obtained = marks.get('obtained_marks', 'N/A')
                total = marks.get('total_marks', 'N/A')
                percentage = marks.get('percentage', 'N/A')
                confidence = marks.get('confidence', 0)
                print(f"   {subject:<15}: {obtained:>3}/{total:<3} ({percentage:>6}%) [conf: {confidence:.2f}]")
        
        # Summary
        if marks_data.get('summary'):
            print("\n📊 SUMMARY:")
            for key, value in marks_data['summary'].items():
                print(f"   {key.replace('_', ' ').title()}: {value}")
        
        return marks_data
        
    except Exception as e:
        print(f"Error in structured extraction: {str(e)}")
        return None

def demo_batch_processing():
    """
    Demonstrate batch processing of multiple marks cards.
    """
    print("\n" + "="*60)
    print("DEMO 3: BATCH PROCESSING")
    print("="*60)
    
    # Create sample directory structure
    sample_dir = Path("sample_marks_cards")
    sample_dir.mkdir(exist_ok=True)
    
    print(f"Looking for images in: {sample_dir.absolute()}")
    
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
    
    # Find all image files
    image_files = [
        f for f in sample_dir.iterdir() 
        if f.suffix.lower() in image_extensions
    ]
    
    if not image_files:
        print(f"No image files found in {sample_dir}")
        print("Please add some marks card images to the 'sample_marks_cards' folder")
        print("Supported formats: JPG, JPEG, PNG, BMP, TIFF")
        return
    
    print(f"Found {len(image_files)} image(s) to process:")
    for img in image_files:
        print(f"  - {img.name}")
    
    # Initialize extractor
    try:
        extractor = MarksCardOCRExtractor()
        
        # Process each image
        results = {}
        for image_file in image_files:
            print(f"\nProcessing: {image_file.name}")
            try:
                result = extractor.process_marks_card(str(image_file))
                results[image_file.name] = result
                print(f"  ✅ Successfully processed {image_file.name}")
            except Exception as e:
                print(f"  ❌ Failed to process {image_file.name}: {str(e)}")
        
        # Save batch results
        if results:
            output_file = "batch_results.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n📁 Batch results saved to: {output_file}")
            
    except Exception as e:
        print(f"Error in batch processing: {str(e)}")

def demo_save_formats(image_path: str):
    """
    Demonstrate saving results in different formats.
    
    Args:
        image_path: Path to the marks card image
    """
    print("\n" + "="*60)
    print("DEMO 4: SAVE IN DIFFERENT FORMATS")
    print("="*60)
    
    try:
        # Initialize extractor
        extractor = MarksCardOCRExtractor()
        
        # Process marks card
        print("Processing marks card...")
        marks_data = extractor.process_marks_card(image_path)
        
        # Create output directory
        output_dir = Path("output")
        output_dir.mkdir(exist_ok=True)
        
        # Save as JSON
        json_file = output_dir / "marks_card_data.json"
        extractor.save_results(marks_data, str(json_file), 'json')
        print(f"📄 JSON format saved to: {json_file}")
        
        # Save as CSV
        csv_file = output_dir / "marks_card_data.csv"
        extractor.save_results(marks_data, str(csv_file), 'csv')
        print(f"📊 CSV format saved to: {csv_file}")
        
        print(f"\n📁 All outputs saved to: {output_dir.absolute()}")
        
    except Exception as e:
        print(f"Error saving formats: {str(e)}")

def demo_custom_settings():
    """
    Demonstrate using custom settings for different scenarios.
    """
    print("\n" + "="*60)
    print("DEMO 5: CUSTOM SETTINGS")
    print("="*60)
    
    # Different extractor configurations
    configs = [
        {
            'name': 'High Accuracy (CPU)',
            'settings': {
                'lang': 'en',
                'use_gpu': False,
                'confidence_threshold': 0.8
            }
        },
        {
            'name': 'Balanced (CPU)',
            'settings': {
                'lang': 'en',
                'use_gpu': False,
                'confidence_threshold': 0.5
            }
        },
        {
            'name': 'Fast Processing (Low Confidence)',
            'settings': {
                'lang': 'en',
                'use_gpu': False,
                'confidence_threshold': 0.3
            }
        }
    ]
    
    print("Available configurations:")
    for i, config in enumerate(configs, 1):
        print(f"  {i}. {config['name']}")
        settings = config['settings']
        print(f"     - Language: {settings['lang']}")
        print(f"     - GPU: {settings['use_gpu']}")
        print(f"     - Confidence Threshold: {settings['confidence_threshold']}")
        print()

def create_sample_structure():
    """Create sample directory structure and files."""
    print("\n" + "="*60)
    print("CREATING SAMPLE DIRECTORY STRUCTURE")
    print("="*60)
    
    # Create directories
    directories = [
        "sample_marks_cards",
        "output",
        "logs"
    ]
    
    for dir_name in directories:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"📁 Created directory: {dir_name}")
    
    # Create a requirements file
    requirements_content = """# OCR Marks Card Extractor Requirements
paddlepaddle>=3.2.0
paddleocr>=3.2.0
pillow>=10.0.0
opencv-python>=4.8.0
opencv-contrib-python>=4.10.0
numpy>=1.24.0
pandas>=2.0.0
matplotlib>=3.7.0
"""
    
    with open("requirements.txt", "w") as f:
        f.write(requirements_content)
    print("📄 Created: requirements.txt")
    
    # Create a README file
    readme_content = """# OCR Marks Card Extractor

## Setup Instructions

1. **Activate Virtual Environment:**
   ```bash
   myenv\\Scripts\\activate  # Windows
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage Examples

### Basic Usage
```python
from ocr_extractor import MarksCardOCRExtractor

# Initialize extractor
extractor = MarksCardOCRExtractor()

# Process a marks card
result = extractor.process_marks_card("path/to/marks_card.jpg")
print(result)
```

### Command Line Usage
```bash
python ocr_extractor.py path/to/marks_card.jpg -o output.json
```

### Run Demo
```bash
python demo.py
```

## Directory Structure
```
Sih-2025/
├── myenv/                  # Virtual environment
├── ocr_extractor.py        # Main OCR module
├── demo.py                 # Demonstration script
├── sample_marks_cards/     # Place your test images here
├── output/                 # Generated output files
└── logs/                   # Log files
```

## Features
- ✅ High-accuracy OCR using PaddleOCR
- ✅ Image preprocessing and enhancement
- ✅ Automatic field extraction (name, roll number, marks, etc.)
- ✅ Multiple output formats (JSON, CSV)
- ✅ Batch processing support
- ✅ Comprehensive error handling
- ✅ Detailed logging
"""
    
    with open("README.md", "w", encoding='utf-8') as f:
        f.write(readme_content)
    print("📄 Created: README.md")

def main():
    """Main demo function."""
    print("🎯 OCR MARKS CARD EXTRACTOR - DEMO SCRIPT")
    print("=" * 60)
    
    # Create sample structure first
    create_sample_structure()
    
    # Check if we have a sample image
    sample_dir = Path("sample_marks_cards")
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
    sample_images = [
        f for f in sample_dir.iterdir() 
        if f.suffix.lower() in image_extensions
    ]
    
    if sample_images:
        # Use first available image for demos
        sample_image = str(sample_images[0])
        print(f"\n🖼️ Using sample image: {sample_images[0].name}")
        
        # Run all demos
        demo_basic_extraction(sample_image)
        demo_structured_extraction(sample_image)
        demo_save_formats(sample_image)
    else:
        print(f"\n📸 No sample images found in {sample_dir}")
        print("Please add some marks card images to the 'sample_marks_cards' folder")
        print("Supported formats: JPG, JPEG, PNG, BMP, TIFF")
    
    # Run demos that don't require images
    demo_batch_processing()
    demo_custom_settings()
    
    print("\n" + "="*60)
    print("✅ DEMO COMPLETED!")
    print("="*60)
    print("\n📖 Next Steps:")
    print("1. Add your marks card images to 'sample_marks_cards/' folder")
    print("2. Run: python demo.py")
    print("3. Or use directly: python ocr_extractor.py your_image.jpg")
    print("4. Check the 'output/' folder for results")

if __name__ == "__main__":
    main()