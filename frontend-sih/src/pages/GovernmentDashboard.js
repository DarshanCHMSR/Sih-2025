import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Shield, LogOut, Settings, Users, FileCheck, BarChart, Activity, Database } from 'lucide-react';

const GovernmentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <Shield size={32} />
            <div>
              <h1 className="text-lg font-bold">Government Dashboard</h1>
              <p className="text-sm opacity-90">New India Credential Kavach</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs opacity-80">Government Official</p>
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
            Welcome, {user?.name || 'Government Administrator'}!
          </h2>
          <p className="text-gray">
            System administration and oversight for New India Credential Kavach platform.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="card text-center py-12">
          <Settings className="mx-auto text-primary mb-6" size={80} />
          <h3 className="text-2xl font-bold text-navy mb-4">
            Government Dashboard Coming Soon
          </h3>
          <p className="text-gray text-lg mb-8 max-w-2xl mx-auto">
            We're developing comprehensive administrative tools for government officials 
            to oversee the entire credential verification system. This dashboard will 
            provide complete system control and insights with the following features:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-6 bg-white rounded-lg border">
              <Users className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">User Management</h4>
              <p className="text-sm text-gray">
                Approve college registrations and manage user accounts
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <BarChart className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">System Analytics</h4>
              <p className="text-sm text-gray">
                View platform statistics, usage metrics, and trends
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Activity className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Audit Logs</h4>
              <p className="text-sm text-gray">
                Monitor all system activities and security events
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Settings className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">System Settings</h4>
              <p className="text-sm text-gray">
                Configure platform settings and verification policies
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <FileCheck className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Document Oversight</h4>
              <p className="text-sm text-gray">
                Monitor document verification processes and quality
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Database className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Data Management</h4>
              <p className="text-sm text-gray">
                Manage institutional databases and verification rules
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Shield className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Security Center</h4>
              <p className="text-sm text-gray">
                Monitor security threats and platform integrity
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <Activity className="mx-auto text-primary mb-4" size={48} />
              <h4 className="font-semibold text-navy mb-2">Reports</h4>
              <p className="text-sm text-gray">
                Generate compliance reports and system summaries
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-green-800">
              <strong>System Status:</strong> Your government account has full administrative 
              access. The comprehensive dashboard features will be available in the next update.
            </p>
          </div>
        </div>

        {/* Quick Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">1,245</div>
            <div className="text-sm text-gray">Total Students</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success">156</div>
            <div className="text-sm text-gray">Registered Colleges</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-navy">8,932</div>
            <div className="text-sm text-gray">Documents Processed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <div className="text-sm text-gray">Pending Approvals</div>
          </div>
        </div>

        {/* Current Account Information */}
        <div className="card">
          <h3 className="card-title">Government Official Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Name</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Department</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.department || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Designation</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.designation || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Employee ID</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.employee_id || 'Not provided'}
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

export default GovernmentDashboard;