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
  const [viewingDocument, setViewingDocument] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        console.error('Failed to load documents');
        setDocuments([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
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

    try {
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name);
      formData.append('document_type', getDocumentType(selectedFile.name));
      formData.append('description', `Uploaded ${selectedFile.name}`);

      const token = localStorage.getItem('token');
      
      setUploadProgress(50);
      
      const response = await fetch('http://localhost:5001/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setUploadProgress(80);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        
        // Reload documents to get the updated list
        await loadDocuments();
        
        setUploadProgress(100);
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          setActiveTab('documents');
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert(`Upload failed: ${errorData.message}`);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploadProgress(0);
    }
  };

  const getDocumentType = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('marksheet') || name.includes('marks')) return 'marksheet';
    if (name.includes('certificate') || name.includes('cert')) return 'certificate';
    if (name.includes('diploma')) return 'diploma';
    return 'document';
  };

  const viewDocument = async (document) => {
    setViewingDocument(document);
    setOcrLoading(true);
    setOcrData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/documents/${document.id}/ocr`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOcrData(data);
      } else {
        console.error('Failed to load OCR data');
        setOcrData({ error: 'Failed to load OCR data' });
      }
    } catch (error) {
      console.error('Error loading OCR data:', error);
      setOcrData({ error: 'Error loading OCR data' });
    } finally {
      setOcrLoading(false);
    }
  };

  const closeDocumentView = () => {
    setViewingDocument(null);
    setOcrData(null);
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
                          <button 
                            className="action-btn"
                            onClick={() => viewDocument(doc)}
                          >
                            <Eye size={16} />
                            View OCR Data
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

      {/* OCR Data Modal */}
      {viewingDocument && (
        <div className="modal-overlay" onClick={closeDocumentView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>OCR Extracted Data - {viewingDocument.title}</h3>
              <button className="modal-close" onClick={closeDocumentView}>×</button>
            </div>
            
            <div className="modal-body">
              {ocrLoading ? (
                <div className="loading-ocr">
                  <div className="loading-spinner"></div>
                  <p>Processing OCR data...</p>
                </div>
              ) : ocrData?.error ? (
                <div className="ocr-error">
                  <XCircle size={48} color="#ef4444" />
                  <h4>Error Loading OCR Data</h4>
                  <p>{ocrData.error}</p>
                </div>
              ) : ocrData?.has_ocr_data ? (
                <div className="ocr-results">
                  <div className="ocr-section">
                    <h4>Document Information</h4>
                    <div className="ocr-grid">
                      <div className="ocr-item">
                        <strong>Document Type:</strong>
                        <span>{viewingDocument.document_type}</span>
                      </div>
                      <div className="ocr-item">
                        <strong>Status:</strong>
                        <span className={`status ${viewingDocument.status}`}>
                          {viewingDocument.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {ocrData.ocr_data && (
                    <div className="ocr-section">
                      <h4>Extracted Information</h4>
                      <div className="ocr-grid">
                        {ocrData.ocr_data.university && (
                          <div className="ocr-item">
                            <strong>University:</strong>
                            <span>{ocrData.ocr_data.university}</span>
                          </div>
                        )}
                        {ocrData.ocr_data.student_name && (
                          <div className="ocr-item">
                            <strong>Student Name:</strong>
                            <span>{ocrData.ocr_data.student_name}</span>
                          </div>
                        )}
                        {ocrData.ocr_data.roll_number && (
                          <div className="ocr-item">
                            <strong>Roll Number:</strong>
                            <span>{ocrData.ocr_data.roll_number}</span>
                          </div>
                        )}
                        {ocrData.ocr_data.result && (
                          <div className="ocr-item">
                            <strong>Result:</strong>
                            <span>{ocrData.ocr_data.result}</span>
                          </div>
                        )}
                      </div>

                      {ocrData.ocr_data.subjects && ocrData.ocr_data.subjects.length > 0 && (
                        <div className="subjects-section">
                          <h5>Subjects & Marks</h5>
                          <div className="subjects-table">
                            {ocrData.ocr_data.subjects.map((subject, index) => (
                              <div key={index} className="subject-row">
                                <span className="subject-code">{subject.course_code}</span>
                                <span className="subject-title">{subject.course_title}</span>
                                <span className="subject-marks">{subject.marks}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {ocrData.extracted_text && (
                    <div className="ocr-section">
                      <h4>Extracted Text</h4>
                      <div className="extracted-text">
                        {ocrData.extracted_text}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-ocr-data">
                  <FileText size={48} color="#9ca3af" />
                  <h4>No OCR Data Available</h4>
                  <p>This document hasn't been processed through OCR yet, or OCR processing failed.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={closeDocumentView}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;