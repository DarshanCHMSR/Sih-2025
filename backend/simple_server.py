#!/usr/bin/env python3
"""
Simple Flask app starter without external dependencies for testing
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

@app.route('/')
def home():
    return jsonify({'message': 'New India Credential Kavach API', 'status': 'running'})

@app.route('/api/documents', methods=['GET'])
def get_documents():
    return jsonify({'documents': [], 'message': 'Test endpoint working'})

@app.route('/api/documents/upload', methods=['POST'])
def upload_document():
    return jsonify({'message': 'Upload endpoint working', 'test': True})

@app.route('/api/auth/login', methods=['POST'])
def login():
    return jsonify({'message': 'Login endpoint working', 'test': True})

if __name__ == '__main__':
    print("🚀 Starting Simple Test Server...")
    print("📍 Server will run on: http://localhost:5001")
    print("🌐 CORS enabled for: http://localhost:3000")
    app.run(host='127.0.0.1', port=5001, debug=True)