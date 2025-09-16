# New India Credential Kavach - Frontend

Professional web application for the Government of Jharkhand's digital credential verification platform. Features responsive design, role-based authentication, and seamless integration with the Flask backend.

## 🚀 Features

- 🏛️ **Government Branding**: Official Government of Jharkhand design with saffron/green/navy color scheme
- 👥 **Multi-Role System**: Dynamic signup/login for Students, Colleges, and Government officials
- 📱 **Responsive Design**: Mobile-first approach with professional desktop layouts
- 🔐 **Secure Authentication**: JWT token-based authentication with role-specific dashboards
- 📄 **Document Management**: Drag-and-drop file upload with real-time processing status
- ✨ **Modern UI/UX**: Clean, professional interface with smooth animations
- 📊 **Dashboard System**: Role-specific dashboards with relevant features and statistics

## 🏗️ Project Structure

```
frontend/
├── index.html                  # Main landing page with hero section and features
├── signup.html                 # Dynamic role-based registration form  
├── login.html                  # Authentication page with validation
├── student-dashboard.html      # Student portal for document management
├── css/
│   └── style.css              # Complete responsive stylesheet
├── js/
│   ├── main.js                # Core utilities and API client
│   ├── signup.js              # Dynamic form generation based on role
│   ├── login.js               # Authentication handling with JWT
│   └── student-dashboard.js   # Dashboard functionality and file upload
└── assets/
    └── images/                # Government logos and branding assets
```

## 🎨 Design System

### Color Palette
- **Primary Saffron**: `#FF6B35` (Government of India heritage)
- **Primary Green**: `#228B22` (Prosperity and growth)  
- **Navy Blue**: `#1e3a8a` (Trust and authority)
- **Light Gray**: `#f8f9fa` (Clean backgrounds)
- **Dark Gray**: `#495057` (Professional text)

### Typography
- **Headers**: Inter font family, bold weights
- **Body Text**: Inter, regular weight for readability
- **Professional**: Government-appropriate typography hierarchy

### Layout System
- **Responsive Grid**: CSS Grid and Flexbox for modern layouts
- **Mobile-First**: Progressive enhancement for larger screens
- **Cards & Components**: Consistent spacing and shadows
- **Navigation**: Clean header with role-based navigation

## 🔧 Getting Started

### 1. Backend Setup (Required)
Before using the frontend, ensure the backend is running:

```powershell
# Navigate to project directory
cd "C:\Users\Darsh\OneDrive\Desktop\Projects\Sih-2025"

# Activate virtual environment
myenv\Scripts\Activate.ps1

# Install and start backend
pip install -r backend\requirements.txt
python backend\main.py
```

The backend will be available at `http://127.0.0.1:5001`

### 2. Open Frontend
Simply open `frontend/index.html` in your browser, or use a local server:

```powershell
# Using Python's built-in server (optional)
cd frontend
python -m http.server 3000
# Then visit: http://localhost:3000
```

### 3. Test the Application
1. **Landing Page**: Visit `index.html` to see the main platform overview
2. **Registration**: Use `signup.html` to create accounts for different roles
3. **Login**: Access `login.html` to authenticate and receive JWT tokens
4. **Dashboard**: After login, access the appropriate role-based dashboard

## 👥 User Roles & Features

### 🎓 Student Features
- **Registration**: Academic details (enrollment number, institution, program)
- **Document Upload**: Drag-and-drop interface for marks cards and certificates
- **OCR Results**: Real-time view of extracted text and structured data
- **Verification Status**: Track document approval status
- **Download**: Access verified documents

### 🏫 College Features *(Coming Soon)*
- **Institutional Registration**: College details and government approval workflow
- **Student Management**: View and verify student documents
- **Bulk Operations**: Upload multiple student records
- **Analytics**: College-specific statistics and reports

### 🏛️ Government Features *(Coming Soon)*
- **System Administration**: Complete platform oversight
- **User Approval**: Approve college and government registrations
- **Audit Logs**: View all system activity and security logs
- **Analytics**: System-wide statistics and insights

## 🔐 Authentication Flow

### Registration Process
1. **Role Selection**: Choose Student, College, or Government
2. **Dynamic Form**: Form fields change based on selected role
3. **Validation**: Real-time form validation with error messages
4. **Submission**: Secure API call to backend with proper data
5. **Verification**: Email verification (if configured)
6. **Approval**: Admin approval for College/Government roles

### Login Process
1. **Credentials**: Email and password authentication
2. **JWT Token**: Receive secure access token from backend
3. **Role Detection**: Automatic redirect to appropriate dashboard
4. **Session Management**: Token stored securely in localStorage
5. **Auto-logout**: Token expiration handling

## 📄 Document Management

### Upload Process
1. **File Selection**: Drag-and-drop or click to select files
2. **Validation**: Client-side file type and size validation
3. **Upload**: Multipart form submission to backend
4. **OCR Processing**: Automatic text extraction using PaddleOCR
5. **Results Display**: Structured data preview with raw text
6. **Status Updates**: Real-time processing and verification status

### Supported File Types
- **Images**: PNG, JPG, JPEG, TIFF, BMP
- **Documents**: PDF (converted for OCR processing)
- **Size Limit**: 16MB maximum per file

### Example OCR Results Display
```javascript
// Structured data shown to users
{
  "student_info": {
    "name": "RAJESH KUMAR", 
    "enrollment_number": "20CS001",
    "semester": "6",
    "programme": "BACHELOR OF COMPUTER APPLICATION"
  },
  "subjects": [
    {
      "subject_name": "DATA STRUCTURES",
      "internal_marks": "18",
      "external_marks": "52", 
      "total_marks": "70",
      "grade": "A"
    }
  ]
}
```

## 🌐 API Integration

### Base Configuration
```javascript
const API_BASE_URL = 'http://127.0.0.1:5001';
const API = {
    auth: {
        signup: `${API_BASE_URL}/api/auth/signup`,
        login: `${API_BASE_URL}/api/auth/login`,
        profile: `${API_BASE_URL}/api/auth/profile`
    },
    documents: {
        upload: `${API_BASE_URL}/api/documents/upload`,
        list: `${API_BASE_URL}/api/documents`,
        download: (id) => `${API_BASE_URL}/api/documents/${id}/download`
    }
};
```

### Authentication Headers
```javascript
// JWT token automatically included in API requests
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
};
```

### Error Handling
```javascript
// Consistent error handling across the application
function handleApiError(error) {
    if (error.status === 401) {
        // Token expired - redirect to login
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
    // Show user-friendly error messages
    showNotification(error.message, 'error');
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (Stack layout, hamburger menu)
- **Tablet**: 768px - 1024px (Adaptive grid, condensed navigation)  
- **Desktop**: > 1024px (Full layout, sidebar navigation)

### Mobile Features
- Touch-friendly buttons and form elements
- Swipe gestures for navigation
- Optimized file upload for mobile cameras
- Progressive enhancement for desktop features

### Performance
- Optimized images and assets
- Minimal JavaScript for fast loading
- CSS Grid and Flexbox for efficient layouts
- Progressive loading for large datasets

## 🎯 Development Guidelines

### Code Organization
```javascript
// main.js - Core utilities and configuration
const Utils = {
    formatDate: (date) => { /* ... */ },
    showNotification: (message, type) => { /* ... */ },
    validateEmail: (email) => { /* ... */ }
};

// Page-specific files handle their own functionality
// signup.js - Registration logic
// login.js - Authentication logic  
// student-dashboard.js - Dashboard features
```

### Naming Conventions
- **CSS Classes**: kebab-case (`.student-dashboard`, `.upload-area`)
- **JavaScript**: camelCase (`handleFileUpload`, `validateForm`)
- **HTML IDs**: kebab-case (`#login-form`, `#file-upload`)
- **API endpoints**: snake_case (following Flask conventions)

### Best Practices
- Progressive enhancement for accessibility
- Semantic HTML for screen readers
- ARIA labels for dynamic content
- Form validation with clear error messages
- Loading states for async operations

## 🔒 Security Considerations

### Client-Side Security
- JWT tokens stored securely in localStorage
- Automatic token expiration handling
- CSRF protection through API design
- Input validation and sanitization
- File type validation before upload

### Privacy Protection
- No sensitive data cached on client
- Secure form submission over HTTPS (production)
- Role-based UI element visibility
- Audit trail for all user actions

## 🚀 Production Deployment

### Build Process
1. **Optimize Assets**: Minify CSS and JavaScript files
2. **Image Optimization**: Compress images for faster loading
3. **CDN Setup**: Serve static assets from CDN
4. **HTTPS**: Ensure SSL certificates for secure connections
5. **Caching**: Configure proper browser caching headers

### Environment Configuration
```javascript
// Production configuration
const CONFIG = {
    API_BASE_URL: 'https://api.credentialkavach.jharkhand.gov.in',
    ENVIRONMENT: 'production',
    DEBUG: false,
    UPLOAD_MAX_SIZE: 16 * 1024 * 1024, // 16MB
    SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'application/pdf']
};
```

### Performance Optimization
- Lazy loading for dashboard components
- Image compression and WebP format support
- JavaScript code splitting for faster initial load
- CSS optimization and unused code removal
- Progressive Web App (PWA) features

## 🐛 Troubleshooting

### Common Issues

**API Connection Problems**
```javascript
// Check if backend is running
fetch('http://127.0.0.1:5001/api/health')
    .then(response => console.log('Backend status:', response.status))
    .catch(error => console.error('Backend not accessible:', error));
```

**Authentication Issues** 
- Check JWT token in browser localStorage
- Verify token hasn't expired
- Ensure backend is using correct JWT secret
- Clear localStorage and re-login if needed

**File Upload Problems**
- Verify file size is under 16MB limit
- Check file type is supported (PNG, JPG, PDF, etc.)
- Ensure backend uploads folder exists and has write permissions
- Check network connection during upload

**Responsive Layout Issues**
- Test on multiple devices and screen sizes
- Verify CSS Grid and Flexbox browser support
- Check viewport meta tag is present
- Use browser developer tools for debugging

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features Used**: CSS Grid, Fetch API, ES6+ JavaScript
- **Polyfills**: Consider adding for older browser support

---

**New India Credential Kavach Frontend - Professional, Secure, Government-Grade Digital Platform** 🇮🇳