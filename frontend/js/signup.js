// Signup Form JavaScript for New India Credential Kavach

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const formFields = document.getElementById('formFields');
    
    // Form field configurations for different roles
    const formConfigs = {
        student: [
            { name: 'fullName', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { name: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
            { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Create a strong password' },
            { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, placeholder: 'Confirm your password' },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true, placeholder: '10-digit mobile number' },
            { name: 'dob', type: 'date', label: 'Date of Birth', required: true },
            { name: 'rollNumber', type: 'text', label: 'Roll Number / Student ID', required: true, placeholder: 'Enter your roll number' },
            { name: 'collegeName', type: 'select', label: 'College Name', required: true, options: [
                'Select your college',
                'Ranchi University',
                'Binod Bihari Mahto Koyalanchal University',
                'Sido Kanhu Murmu University',
                'Kolhan University',
                'Dr. Shyama Prasad Mukherjee University',
                'Nilamber Pitamber University',
                'Other'
            ]},
            { name: 'course', type: 'text', label: 'Course/Branch', required: true, placeholder: 'e.g., B.Tech CSE, BA English, etc.' },
            { name: 'yearOfStudy', type: 'select', label: 'Year of Study / Passing Year', required: true, options: [
                'Select year',
                '1st Year',
                '2nd Year',
                '3rd Year',
                '4th Year',
                'Passed - 2025',
                'Passed - 2024',
                'Passed - 2023',
                'Passed - 2022',
                'Other'
            ]},
            { name: 'marksheet', type: 'file', label: 'Upload Marksheet', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
            { name: 'idProof', type: 'file', label: 'Upload ID Proof (Aadhaar/College ID)', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ],
        college: [
            { name: 'collegeName', type: 'text', label: 'College Name', required: true, placeholder: 'Enter official college name' },
            { name: 'collegeCode', type: 'text', label: 'College Code/ID', required: true, placeholder: 'Government assigned college code' },
            { name: 'email', type: 'email', label: 'Official Email', required: true, placeholder: 'Official college email' },
            { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Create a strong password' },
            { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, placeholder: 'Confirm your password' },
            { name: 'phone', type: 'tel', label: 'Official Phone Number', required: true, placeholder: 'College contact number' },
            { name: 'address', type: 'textarea', label: 'College Address', required: true, placeholder: 'Complete college address' },
            { name: 'university', type: 'select', label: 'Affiliated University', required: true, options: [
                'Select affiliated university',
                'Ranchi University',
                'Binod Bihari Mahto Koyalanchal University',
                'Sido Kanhu Murmu University',
                'Kolhan University',
                'Dr. Shyama Prasad Mukherjee University',
                'Nilamber Pitamber University',
                'Jharkhand University of Technology',
                'Other'
            ]},
            { name: 'adminName', type: 'text', label: 'Admin Contact Person Name', required: true, placeholder: 'Principal/Registrar name' },
            { name: 'accreditationProof', type: 'file', label: 'Accreditation/Approval Proof', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ],
        government: [
            { name: 'departmentName', type: 'text', label: 'Department/Authority Name', required: true, placeholder: 'e.g., Department of Higher Education' },
            { name: 'email', type: 'email', label: 'Official Email', required: true, placeholder: 'Government email address' },
            { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Create a strong password' },
            { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true, placeholder: 'Confirm your password' },
            { name: 'phone', type: 'tel', label: 'Official Phone Number', required: true, placeholder: 'Department contact number' },
            { name: 'designation', type: 'text', label: 'Designation of Officer', required: true, placeholder: 'e.g., Registrar, Verification Officer' },
            { name: 'employeeId', type: 'text', label: 'Employee ID', required: true, placeholder: 'Government employee ID' },
            { name: 'govIdProof', type: 'file', label: 'Government ID Proof', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ]
    };
    
    // Generate form fields based on selected role
    function generateFormFields(role) {
        const config = formConfigs[role];
        let html = '';
        
        config.forEach(field => {
            html += `<div class="form-group">`;
            html += `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
            
            if (field.type === 'select') {
                html += `<select id="${field.name}" name="${field.name}" class="form-control form-select"${field.required ? ' required' : ''}>`;
                field.options.forEach(option => {
                    html += `<option value="${option === field.options[0] ? '' : option}">${option}</option>`;
                });
                html += `</select>`;
            } else if (field.type === 'textarea') {
                html += `<textarea id="${field.name}" name="${field.name}" class="form-control" rows="3"${field.required ? ' required' : ''} placeholder="${field.placeholder || ''}"></textarea>`;
            } else if (field.type === 'file') {
                html += `<div class="file-upload">`;
                html += `<input type="file" id="${field.name}" name="${field.name}"${field.required ? ' required' : ''}${field.accept ? ` accept="${field.accept}"` : ''}>`;
                html += `<label for="${field.name}" class="file-upload-label" id="${field.name}Label">`;
                html += `📎 Click to choose file or drag and drop`;
                html += `</label>`;
                html += `</div>`;
            } else {
                html += `<input type="${field.type}" id="${field.name}" name="${field.name}" class="form-control"${field.required ? ' required' : ''} placeholder="${field.placeholder || ''}"${field.type === 'date' ? ` max="${new Date().toISOString().split('T')[0]}"` : ''}>`;
            }
            
            html += `</div>`;
        });
        
        formFields.innerHTML = html;
        
        // Setup file uploads
        config.filter(field => field.type === 'file').forEach(field => {
            window.CredentialKavach.setupFileUpload(field.name, field.name + 'Label');
        });
    }
    
    // Handle role change
    roleInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                generateFormFields(this.value);
            }
        });
    });
    
    // Initialize with student form
    generateFormFields('student');
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate form
        if (!window.CredentialKavach.validateForm(form)) {
            return;
        }
        
        // Check password confirmation
        const password = form.password?.value;
        const confirmPassword = form.confirmPassword?.value;
        
        if (password && confirmPassword && password !== confirmPassword) {
            window.CredentialKavach.showAlert('Passwords do not match', 'error');
            return;
        }
        
        window.CredentialKavach.showLoading(submitBtn, true);
        
        try {
            const formData = new FormData(form);
            const role = document.querySelector('input[name="role"]:checked').value;
            formData.append('role', role);
            
            // Convert FormData to JSON (excluding files for now)
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (!(value instanceof File)) {
                    data[key] = value;
                }
            }
            
            const result = await window.CredentialKavach.makeAPIRequest('/auth/signup', 'POST', data);
            
            window.CredentialKavach.showAlert('Account created successfully! Please check your email for verification.', 'success');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            window.CredentialKavach.showAlert(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            window.CredentialKavach.showLoading(submitBtn, false);
        }
    });
    
    // Add real-time validation
    form.addEventListener('input', function(e) {
        const input = e.target;
        if (input.value.trim()) {
            clearFieldError(input);
        }
    });
    
    function clearFieldError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
});