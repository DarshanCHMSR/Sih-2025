# OCR Marks Card Extractor

## Setup Instructions

1. **Activate Virtual Environment:**
   ```bash
   myenv\Scripts\activate  # Windows
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
