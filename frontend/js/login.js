// Login Form JavaScript for New India Credential Kavach

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = form.email.value.trim();
        const password = form.password.value;
        const rememberMe = form.rememberMe.checked;
        
        // Basic validation
        if (!email || !password) {
            window.CredentialKavach.showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (!window.CredentialKavach.validateForm(form)) {
            return;
        }
        
        window.CredentialKavach.showLoading(submitBtn, true);
        
        try {
            const result = await window.CredentialKavach.makeAPIRequest('/auth/login', 'POST', {
                email,
                password,
                rememberMe
            });
            
            // Save authentication data
            window.CredentialKavach.saveAuthData(result.token, result.user);
            
            window.CredentialKavach.showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                window.CredentialKavach.redirectToDashboard(result.user.role);
            }, 1000);
            
        } catch (error) {
            window.CredentialKavach.showAlert(error.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
            window.CredentialKavach.showLoading(submitBtn, false);
        }
    });
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
    
    function clearFieldError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Check if user is already logged in
    const authData = window.CredentialKavach.getAuthData();
    if (authData) {
        window.CredentialKavach.redirectToDashboard(authData.user.role);
    }
});