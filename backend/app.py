import os
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import re
import json
import secrets

try:
    from .final_ocr_system import MarksCardOCRSystem
except Exception:
    # Fallback when running app.py directly
    from final_ocr_system import MarksCardOCRSystem

# Flask config
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
RESULTS_FOLDER = os.path.join(os.path.dirname(__file__), 'web_results')
ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.bmp', '.tif', '.tiff'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

app = Flask(__name__)

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize CORS
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:5500', 'file://'])

# Simple JWT token creation
def create_simple_token(user_id, role):
    """Create a simple token for authentication"""
    import base64
    import time
    
    token_data = {
        'user_id': user_id,
        'role': role,
        'exp': time.time() + (24 * 3600)  # 24 hours expiry
    }
    token_str = json.dumps(token_data)
    return base64.b64encode(token_str.encode()).decode()

def generate_random_id(length=8):
    import random, string
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# API route to get all documents in chronological order (public)
@app.route('/api/documents', methods=['GET'])
def api_documents():
    results_dir = app.config['RESULTS_FOLDER']
    docs = []
    if os.path.exists(results_dir):
        runs = [d for d in os.listdir(results_dir) if os.path.isdir(os.path.join(results_dir, d))]
        def extract_ts(name):
            parts = name.split('_')
            if len(parts) >= 2:
                try:
                    return datetime.strptime(parts[0] + '_' + parts[1], '%Y%m%d_%H%M%S')
                except Exception:
                    return datetime.min
            return datetime.min
        runs_sorted = sorted(runs, key=extract_ts, reverse=True)
        for run_id in runs_sorted:
            block_id = generate_random_id()
            docs.append({
                'id': block_id,
                'run_id': run_id,
                'name': run_id,
                'link': f'/result/{run_id}'
            })
    return jsonify(docs)


def allowed_file(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return redirect(url_for('index'))

    file = request.files['file']
    if file.filename == '':
        return redirect(url_for('index'))

    if file and allowed_file(file.filename):
        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(f"{ts}_" + file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Run OCR
        ocr = MarksCardOCRSystem(confidence_threshold=0.5)
        data = ocr.process_marks_card(
            file_path,
            preprocess=True,
            do_deskew=True,
            do_denoise=True,
            use_adaptive=True,
            contrast=True,
            temp_dir=os.path.join(app.config['RESULTS_FOLDER'], 'preprocessed')
        )

        # Save results to dedicated folder per upload
        out_dir = os.path.join(app.config['RESULTS_FOLDER'], os.path.splitext(filename)[0])
        ocr.save_results(data, out_dir)

        return redirect(url_for('result', run_id=os.path.basename(out_dir)))

    return redirect(url_for('index'))


@app.route('/result/<run_id>', methods=['GET'])
def result(run_id: str):
    out_dir = os.path.join(app.config['RESULTS_FOLDER'], run_id)
    json_path = os.path.join(out_dir, 'marks_card_structured.json')

    if not os.path.exists(json_path):
        return redirect(url_for('index'))

    with open(json_path, 'r', encoding='utf-8') as f:
        data = f.read()

    return render_template('result.html', run_id=run_id, data_json=data)


@app.route('/download/<run_id>/<path:filename>')
def download(run_id: str, filename: str):
    out_dir = os.path.join(app.config['RESULTS_FOLDER'], run_id)
    return send_from_directory(out_dir, filename, as_attachment=True)


@app.route('/api/result/<run_id>')
def api_result(run_id: str):
    out_dir = os.path.join(app.config['RESULTS_FOLDER'], run_id)
    json_path = os.path.join(out_dir, 'marks_card_structured.json')
    if not os.path.exists(json_path):
        return jsonify({'error': 'not found'}), 404
    with open(json_path, 'r', encoding='utf-8') as f:
        return jsonify(**__import__('json').load(f))


# Simple user storage (in production, use proper database)
users_db = {
    'admin@credentialkavach.gov.in': {
        'id': str(uuid.uuid4()),
        'email': 'admin@credentialkavach.gov.in',
        'password_hash': generate_password_hash('Admin@123'),
        'full_name': 'Government Administrator',
        'phone': '9999999999',
        'role': 'government',
        'is_verified': True,
        'is_approved': True,
        'is_active': True
    },
    'student@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'student@example.com',
        'password_hash': generate_password_hash('Student@123'),
        'full_name': 'Test Student',
        'phone': '9876543210',
        'role': 'student',
        'is_verified': True,
        'is_approved': True,
        'is_active': True
    },
    'college@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'college@example.com',
        'password_hash': generate_password_hash('College@123'),
        'full_name': 'Test College Admin',
        'phone': '9876543211',
        'role': 'college',
        'is_verified': True,
        'is_approved': True,
        'is_active': True
    },
    'employer@example.com': {
        'id': str(uuid.uuid4()),
        'email': 'employer@example.com',
        'password_hash': generate_password_hash('Employer@123'),
        'full_name': 'Test Employer',
        'phone': '9876543212',
        'role': 'employer',
        'is_verified': True,
        'is_approved': True,
        'is_active': True
    }
}

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Check user in simple storage
        user = users_db.get(email)
        
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        if not user.get('is_active', True):
            return jsonify({'message': 'Account is deactivated'}), 401
        
        if not user.get('is_verified', True):
            return jsonify({'message': 'Please verify your email before logging in'}), 401
        
        # Create tokens
        access_token = create_simple_token(user['id'], user['role'])
        refresh_token = create_simple_token(user['id'], user['role'])  # Same for simplicity
        
        # Prepare user data (exclude sensitive information)
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'phone': user['phone'],
            'role': user['role'],
            'is_verified': user['is_verified'],
            'is_approved': user['is_approved']
        }
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user_data
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} is required'}), 400
        
        # Validate email format
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Check if user already exists
        if data['email'] in users_db:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Validate role
        if data['role'] not in ['student', 'college', 'employer', 'government']:
            return jsonify({'message': 'Invalid role'}), 400
        
        # Create user
        user_id = str(uuid.uuid4())
        users_db[data['email']] = {
            'id': user_id,
            'email': data['email'],
            'password_hash': generate_password_hash(data['password']),
            'full_name': data.get('name', ''),
            'phone': data.get('phone', ''),
            'role': data['role'],
            'is_verified': True,  # Skip email verification for demo
            'is_approved': True if data['role'] in ['student', 'employer'] else False,
            'is_active': True
        }
        
        return jsonify({
            'message': 'Registration successful!',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

# Try to import and register blueprints if available
try:
    from routes.auth import auth_bp
    from routes.api import api_bp  
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    print("All blueprints registered successfully")
except ImportError as e:
    print(f"Warning: Could not import blueprints, using simple auth: {e}")

print("Simple user authentication system initialized")

if __name__ == '__main__':
    # Run on port 5001 to match frontend expectations
    port = int(os.environ.get('PORT', '5001'))
    print(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
