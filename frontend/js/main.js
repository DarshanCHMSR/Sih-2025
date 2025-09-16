// Main JavaScript for New India Credential Kavach

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Utility Functions
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showLoading(button, show = true) {
    const spinner = button.querySelector('#loadingSpinner');
    const text = button.querySelector('#submitText');
    
    if (show) {
        spinner.style.display = 'block';
        text.style.display = 'none';
        button.disabled = true;
    } else {
        spinner.style.display = 'none';
        text.style.display = 'inline';
        button.disabled = false;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        // Specific validations
        if (input.type === 'email' && !validateEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.name === 'phone' && !validatePhone(value)) {
            showFieldError(input, 'Please enter a valid 10-digit mobile number');
            isValid = false;
        } else if (input.type === 'password' && !validatePassword(value)) {
            showFieldError(input, 'Password must be at least 8 characters with uppercase, lowercase, and number');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.style.borderColor = 'var(--error-color)';
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// API Functions
async function makeAPIRequest(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Authentication Functions
function saveAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
}

function getAuthData() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        return {
            token,
            user: JSON.parse(userData)
        };
    }
    
    return null;
}

function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

function redirectToDashboard(role) {
    const dashboardUrls = {
        student: 'student-dashboard.html',
        college: 'college-dashboard.html',
        government: 'government-dashboard.html'
    };
    
    window.location.href = dashboardUrls[role] || 'index.html';
}

// Check if user is authenticated
function checkAuth() {
    const authData = getAuthData();
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that require authentication
    const protectedPages = [
        'student-dashboard.html',
        'college-dashboard.html',
        'government-dashboard.html'
    ];
    
    if (protectedPages.includes(currentPage) && !authData) {
        window.location.href = 'login.html';
        return false;
    }
    
    return authData;
}

// File Upload Helper
function setupFileUpload(inputId, labelId) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    
    if (!input || !label) return;
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            label.textContent = `Selected: ${file.name}`;
            label.style.color = 'var(--success-color)';
        } else {
            label.textContent = 'Click to choose file or drag and drop';
            label.style.color = '';
        }
    });
    
    // Drag and drop functionality
    label.addEventListener('dragover', function(e) {
        e.preventDefault();
        label.style.borderColor = 'var(--primary-color)';
    });
    
    label.addEventListener('dragleave', function(e) {
        e.preventDefault();
        label.style.borderColor = '';
    });
    
    label.addEventListener('drop', function(e) {
        e.preventDefault();
        label.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            label.textContent = `Selected: ${files[0].name}`;
            label.style.color = 'var(--success-color)';
        }
    });
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 100);
    });
    
    // Set initial opacity for fade-in elements
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease-out';
    });
    
    // Check authentication on protected pages
    checkAuth();
});

// Export functions for use in other files
window.CredentialKavach = {
    showAlert,
    showLoading,
    validateForm,
    makeAPIRequest,
    saveAuthData,
    getAuthData,
    clearAuthData,
    redirectToDashboard,
    setupFileUpload
};