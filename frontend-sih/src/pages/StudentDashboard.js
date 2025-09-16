import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  LogOut, 
  User, 
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  IdCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Mock data for now since OCR endpoints aren't ready
      const mockDocuments = [
        {
          id: '1',
          title: '10th Marksheet',
          document_type: 'marksheet',
          status: 'verified',
          created_at: '2024-01-15T10:30:00Z',
          verification_date: '2024-01-16T14:20:00Z',
          verification_notes: 'All details verified successfully'
        },
        {
          id: '2',
          title: '12th Certificate',
          document_type: 'certificate',
          status: 'pending',
          created_at: '2024-01-20T09:15:00Z'
        },
        {
          id: '3',
          title: 'Graduation Certificate',
          document_type: 'certificate',
          status: 'rejected',
          created_at: '2024-01-25T16:45:00Z',
          verification_notes: 'Image quality too low, please re-upload'
        }
      ];
      setDocuments(mockDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading documents:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Mock upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Add to documents list
    const newDocument = {
      id: Date.now().toString(),
      title: selectedFile.name,
      document_type: 'document',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setDocuments([newDocument, ...documents]);
    setSelectedFile(null);
    setUploadProgress(0);
    setActiveTab('documents');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={20} color="#22c55e" />;
      case 'pending':
        return <Clock size={20} color="#f59e0b" />;
      case 'rejected':
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <FileText size={20} color="#6b7280" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">
                <GraduationCap size={32} color="#FF6B35" />
              </div>
              <div className="logo-text">
                <h1>Student Dashboard</h1>
                <p>New India Credential Kavach</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <User size={20} />
              <span>{user?.full_name || 'Student'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <User size={18} />
                Overview
              </button>
              <button 
                className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload size={18} />
                Upload Document
              </button>
              <button 
                className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <FileText size={18} />
                My Documents
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <section className="dashboard-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <h2>Welcome back, {user?.full_name || 'Student'}!</h2>
                
                {/* Profile Card */}
                <div className="profile-card">
                  <h3>Your Profile</h3>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <Mail size={18} />
                      <div>
                        <label>Email</label>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div className="profile-item">
                      <Phone size={18} />
                      <div>
                        <label>Phone</label>
                        <span>{user?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="profile-item">
                      <IdCard size={18} />
                      <div>
                        <label>Roll Number</label>
                        <span>{user?.roll_number || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="profile-item">
                      <GraduationCap size={18} />
                      <div>
                        <label>Course</label>
                        <span>{user?.course || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FileText size={24} color="#FF6B35" />
                    </div>
                    <div className="stat-info">
                      <h3>{documents.length}</h3>
                      <p>Total Documents</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <CheckCircle size={24} color="#22c55e" />
                    </div>
                    <div className="stat-info">
                      <h3>{documents.filter(doc => doc.status === 'verified').length}</h3>
                      <p>Verified</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Clock size={24} color="#f59e0b" />
                    </div>
                    <div className="stat-info">
                      <h3>{documents.filter(doc => doc.status === 'pending').length}</h3>
                      <p>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="upload-tab">
                <h2>Upload Document</h2>
                <p>Upload your academic documents for verification</p>

                <div className="upload-section">
                  <div 
                    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload size={48} color="#FF6B35" />
                    <h3>Drag & Drop your document here</h3>
                    <p>or click to browse files</p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="browse-btn">
                      Browse Files
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="selected-file">
                      <FileText size={20} />
                      <span>{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}>×</button>
                    </div>
                  )}

                  {uploadProgress > 0 && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}

                  <button 
                    className="upload-btn"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadProgress > 0}
                  >
                    Upload Document
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="documents-tab">
                <h2>My Documents</h2>
                <p>Track the status of your uploaded documents</p>

                {loading ? (
                  <div className="loading">Loading documents...</div>
                ) : documents.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} color="#9ca3af" />
                    <h3>No documents uploaded yet</h3>
                    <p>Upload your first document to get started</p>
                    <button 
                      className="primary-btn"
                      onClick={() => setActiveTab('upload')}
                    >
                      Upload Document
                    </button>
                  </div>
                ) : (
                  <div className="documents-list">
                    {documents.map(doc => (
                      <div key={doc.id} className="document-card">
                        <div className="doc-header">
                          <div className="doc-title">
                            <FileText size={20} />
                            <h3>{doc.title}</h3>
                          </div>
                          <div className="doc-status">
                            {getStatusIcon(doc.status)}
                            <span style={{ color: getStatusColor(doc.status) }}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="doc-details">
                          <div className="doc-meta">
                            <span>Type: {doc.document_type}</span>
                            <span>Uploaded: {formatDate(doc.created_at)}</span>
                            {doc.verification_date && (
                              <span>Verified: {formatDate(doc.verification_date)}</span>
                            )}
                          </div>
                          {doc.verification_notes && (
                            <div className="doc-notes">
                              <strong>Notes:</strong> {doc.verification_notes}
                            </div>
                          )}
                        </div>
                        <div className="doc-actions">
                          <button className="action-btn">
                            <Eye size={16} />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;