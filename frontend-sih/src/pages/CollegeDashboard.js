import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Shield, LogOut, Building, Users, FileCheck, BarChart } from 'lucide-react';

const CollegeDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <Shield size={32} />
            <div>
              <h1 className="text-lg font-bold">College Dashboard</h1>
              <p className="text-sm opacity-90">New India Credential Kavach</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.college_name || user?.email}</p>
              <p className="text-xs opacity-80">College Account</p>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy mb-2">
            Welcome, {user?.college_name || 'College Administrator'}!
          </h2>
          <p className="text-gray">
            Manage student documents and institutional verification processes.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="card text-center py-12">
          <Building className="mx-auto text-primary mb-6" size={80} />
          <h3 className="text-2xl font-bold text-navy mb-4">
            College Dashboard Coming Soon
          </h3>
          <p className="text-gray text-lg mb-8 max-w-2xl mx-auto">
            We're building powerful tools for educational institutions to manage student 
            credentials, verify documents, and access institutional analytics. This dashboard 
            will be available soon with the following features:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-6 bg-white rounded-lg border">
              <Users className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Student Management</h4>
              <p className="text-sm text-gray">
                View and manage student documents submitted for verification
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <FileCheck className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Document Verification</h4>
              <p className="text-sm text-gray">
                Approve or reject student documents with detailed notes
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <BarChart className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Analytics</h4>
              <p className="text-sm text-gray">
                Track verification statistics and institutional insights
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Building className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Institution Profile</h4>
              <p className="text-sm text-gray">
                Manage college information and verification settings
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your college account has been registered and is pending government 
              approval. Once approved, you'll have full access to the college dashboard features.
            </p>
          </div>
        </div>

        {/* Current Account Status */}
        <div className="card mt-8">
          <h3 className="card-title">College Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">College Name</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.college_name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Registration Number</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.registration_number || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Contact Person</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.contact_person || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Designation</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.designation || 'Not provided'}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Email</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;