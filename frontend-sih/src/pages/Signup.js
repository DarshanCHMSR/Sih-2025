import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Role-specific fields
  const [roleFields, setRoleFields] = useState({});

  useEffect(() => {
    if (selectedRole) {
      setFormData(prev => ({ ...prev, role: selectedRole }));
      initializeRoleFields(selectedRole);
    }
  }, [selectedRole]);

  const initializeRoleFields = (role) => {
    const fields = {};
    
    switch (role) {
      case 'student':
        fields.name = '';
        fields.enrollment_number = '';
        fields.institution = '';
        fields.program = '';
        fields.semester = '';
        fields.academic_year = '';
        break;
      case 'college':
        fields.college_name = '';
        fields.registration_number = '';
        fields.address = '';
        fields.contact_person = '';
        fields.designation = '';
        fields.affiliation = '';
        break;
      case 'government':
        fields.name = '';
        fields.department = '';
        fields.designation = '';
        fields.employee_id = '';
        fields.office_address = '';
        break;
      default:
        break;
    }
    
    setRoleFields(fields);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    initializeRoleFields(role);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (Object.keys(roleFields).includes(name)) {
      setRoleFields(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validation
    const requiredRoleFields = {
      student: ['name', 'enrollment_number', 'institution', 'program'],
      college: ['college_name', 'registration_number', 'contact_person', 'designation'],
      government: ['name', 'department', 'designation', 'employee_id']
    };

    const required = requiredRoleFields[formData.role] || [];
    required.forEach(field => {
      if (!roleFields[field] || roleFields[field].trim() === '') {
        newErrors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        ...roleFields
      };
      delete submitData.confirmPassword;

      await signup(submitData);
      toast.success('Account created successfully! Please log in to continue.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={roleFields.name || ''}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Enrollment Number *</label>
              <input
                type="text"
                name="enrollment_number"
                value={roleFields.enrollment_number || ''}
                onChange={handleChange}
                className={`form-input ${errors.enrollment_number ? 'border-red-500' : ''}`}
                placeholder="Enter your enrollment number"
              />
              {errors.enrollment_number && <div className="form-error">{errors.enrollment_number}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Institution *</label>
              <input
                type="text"
                name="institution"
                value={roleFields.institution || ''}
                onChange={handleChange}
                className={`form-input ${errors.institution ? 'border-red-500' : ''}`}
                placeholder="Enter your institution name"
              />
              {errors.institution && <div className="form-error">{errors.institution}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Program *</label>
              <input
                type="text"
                name="program"
                value={roleFields.program || ''}
                onChange={handleChange}
                className={`form-input ${errors.program ? 'border-red-500' : ''}`}
                placeholder="e.g., Bachelor of Computer Science"
              />
              {errors.program && <div className="form-error">{errors.program}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select
                  name="semester"
                  value={roleFields.semester || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  name="academic_year"
                  value={roleFields.academic_year || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., 2023-24"
                />
              </div>
            </div>
          </>
        );

      case 'college':
        return (
          <>
            <div className="form-group">
              <label className="form-label">College Name *</label>
              <input
                type="text"
                name="college_name"
                value={roleFields.college_name || ''}
                onChange={handleChange}
                className={`form-input ${errors.college_name ? 'border-red-500' : ''}`}
                placeholder="Enter college name"
              />
              {errors.college_name && <div className="form-error">{errors.college_name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                name="registration_number"
                value={roleFields.registration_number || ''}
                onChange={handleChange}
                className={`form-input ${errors.registration_number ? 'border-red-500' : ''}`}
                placeholder="College registration number"
              />
              {errors.registration_number && <div className="form-error">{errors.registration_number}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">College Address</label>
              <textarea
                name="address"
                value={roleFields.address || ''}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Enter college address"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                name="contact_person"
                value={roleFields.contact_person || ''}
                onChange={handleChange}
                className={`form-input ${errors.contact_person ? 'border-red-500' : ''}`}
                placeholder="Principal/Admin name"
              />
              {errors.contact_person && <div className="form-error">{errors.contact_person}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={roleFields.designation || ''}
                  onChange={handleChange}
                  className={`form-input ${errors.designation ? 'border-red-500' : ''}`}
                  placeholder="e.g., Principal"
                />
                {errors.designation && <div className="form-error">{errors.designation}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Affiliation</label>
                <input
                  type="text"
                  name="affiliation"
                  value={roleFields.affiliation || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="University/Board affiliation"
                />
              </div>
            </div>
          </>
        );

      case 'government':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={roleFields.name || ''}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                name="department"
                value={roleFields.department || ''}
                onChange={handleChange}
                className={`form-select ${errors.department ? 'border-red-500' : ''}`}
              >
                <option value="">Select Department</option>
                <option value="Education">Department of Education</option>
                <option value="Higher Education">Department of Higher Education</option>
                <option value="Skill Development">Department of Skill Development</option>
                <option value="IT">Department of IT</option>
                <option value="Other">Other</option>
              </select>
              {errors.department && <div className="form-error">{errors.department}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={roleFields.designation || ''}
                  onChange={handleChange}
                  className={`form-input ${errors.designation ? 'border-red-500' : ''}`}
                  placeholder="e.g., Additional Secretary"
                />
                {errors.designation && <div className="form-error">{errors.designation}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Employee ID *</label>
                <input
                  type="text"
                  name="employee_id"
                  value={roleFields.employee_id || ''}
                  onChange={handleChange}
                  className={`form-input ${errors.employee_id ? 'border-red-500' : ''}`}
                  placeholder="Government employee ID"
                />
                {errors.employee_id && <div className="form-error">{errors.employee_id}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Office Address</label>
              <textarea
                name="office_address"
                value={roleFields.office_address || ''}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Enter office address"
              ></textarea>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-navy hover:text-primary">
            <Shield size={40} />
            <div className="text-left">
              <h1 className="text-xl font-bold">New India Credential Kavach</h1>
              <p className="text-sm text-gray">Government of Jharkhand</p>
            </div>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="card">
          <div className="card-header text-center">
            <h2 className="card-title">Create Your Account</h2>
            <p className="card-subtitle">Join the secure credential verification platform</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Select Your Role *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: 'Student', desc: 'Verify your academic documents' },
                  { value: 'college', label: 'College', desc: 'Manage institutional records' },
                  { value: 'government', label: 'Government', desc: 'Administrative access' }
                ].map((role) => (
                  <div
                    key={role.value}
                    onClick={() => handleRoleChange(role.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      selectedRole === role.value
                        ? 'border-primary bg-orange-50 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-gray mt-1">{role.desc}</div>
                  </div>
                ))}
              </div>
              {errors.role && <div className="form-error">{errors.role}</div>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Role-specific Fields */}
            {selectedRole && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-navy mb-4">
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Information
                </h3>
                {renderRoleSpecificFields()}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="btn btn-primary w-full mt-6"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Note for College/Government */}
          {selectedRole && ['college', 'government'].includes(selectedRole) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} accounts require approval from government administrators before access is granted.
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-gray hover:text-navy"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;