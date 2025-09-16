import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  LogOut, 
  User, 
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CollegeDashboard.css';

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Mock data for college dashboard - Students specific to this college
      const collegeName = user?.college_name || 'National Institute of Technology';
      const mockStudents = [
        {
          id: '1',
          name: 'Raj Kumar',
          email: 'raj@student.com',
          rollNumber: 'CS001',
          course: 'Computer Science',
          semester: '6',
          college_name: collegeName,
          documentsCount: 3,
          verifiedCount: 2,
          pendingCount: 1
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya@student.com',
          rollNumber: 'CS002',
          course: 'Computer Science',
          semester: '6',
          college_name: collegeName,
          documentsCount: 4,
          verifiedCount: 3,
          pendingCount: 1
        },
        {
          id: '3',
          name: 'Amit Singh',
          email: 'amit@student.com',
          rollNumber: 'EE001',
          course: 'Electrical Engineering',
          semester: '8',
          college_name: collegeName,
          documentsCount: 5,
          verifiedCount: 4,
          pendingCount: 1
        },
        {
          id: '4',
          name: 'Sneha Patel',
          email: 'sneha@student.com',
          rollNumber: 'ME001',
          course: 'Mechanical Engineering',
          semester: '4',
          college_name: collegeName,
          documentsCount: 2,
          verifiedCount: 1,
          pendingCount: 1
        },
        {
          id: '5',
          name: 'Rohit Gupta',
          email: 'rohit@student.com',
          rollNumber: 'CE001',
          course: 'Civil Engineering',
          semester: '2',
          college_name: collegeName,
          documentsCount: 3,
          verifiedCount: 2,
          pendingCount: 1
        }
      ];

      const mockDocuments = [
        {
          id: '1',
          studentName: 'Raj Kumar',
          rollNumber: 'CS001',
          college_name: collegeName,
          title: '10th Marksheet',
          document_type: 'marksheet',
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z',
          uploaded_by: '1'
        },
        {
          id: '2',
          studentName: 'Priya Sharma',
          rollNumber: 'CS002',
          college_name: collegeName,
          title: '12th Certificate',
          document_type: 'certificate',
          status: 'pending',
          created_at: '2024-01-20T09:15:00Z',
          uploaded_by: '2'
        },
        {
          id: '3',
          studentName: 'Amit Singh',
          rollNumber: 'EE001',
          college_name: collegeName,
          title: 'Graduation Certificate',
          document_type: 'certificate',
          status: 'verified',
          created_at: '2024-01-25T16:45:00Z',
          verification_date: '2024-01-26T10:20:00Z',
          verified_by: user?.id,
          verification_notes: 'Document verified successfully',
          uploaded_by: '3'
        },
        {
          id: '4',
          studentName: 'Sneha Patel',
          rollNumber: 'ME001',
          college_name: collegeName,
          title: 'Transfer Certificate',
          document_type: 'certificate',
          status: 'pending',
          created_at: '2024-01-28T11:30:00Z',
          uploaded_by: '4'
        },
        {
          id: '5',
          studentName: 'Rohit Gupta',
          rollNumber: 'CE001',
          college_name: collegeName,
          title: 'Character Certificate',
          document_type: 'certificate',
          status: 'verified',
          created_at: '2024-01-29T14:15:00Z',
          verification_date: '2024-01-30T09:45:00Z',
          verified_by: user?.id,
          verification_notes: 'All details verified and approved',
          uploaded_by: '5'
        }
      ];

      setStudents(mockStudents);
      setDocuments(mockDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleVerifyDocument = async (doc, action, notes = '') => {
    try {
      // Mock verification process
      const updatedDocuments = documents.map(document => {
        if (document.id === doc.id) {
          return {
            ...document,
            status: action,
            verification_date: new Date().toISOString(),
            verified_by: user?.id,
            verification_notes: notes
          };
        }
        return document;
      });

      setDocuments(updatedDocuments);
      setShowVerificationModal(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error verifying document:', error);
    }
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
        return <CheckCircle size={16} color="#22c55e" />;
      case 'pending':
        return <Clock size={16} color="#f59e0b" />;
      case 'rejected':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <FileText size={16} color="#6b7280" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalStudents: students.length,
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(doc => doc.status === 'pending').length,
    verifiedDocuments: documents.filter(doc => doc.status === 'verified').length,
    rejectedDocuments: documents.filter(doc => doc.status === 'rejected').length
  };

  return (
    <div className="college-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">
                <Building size={32} color="#FF6B35" />
              </div>
              <div className="logo-text">
                <h1>College Dashboard</h1>
                <p>New India Credential Kavach</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <User size={20} />
              <span>{user?.college_name || user?.full_name || 'College Admin'}</span>
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
                <Building size={18} />
                Overview
              </button>
              <button 
                className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <Users size={18} />
                Students
              </button>
              <button 
                className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <FileText size={18} />
                Document Verification
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <section className="dashboard-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <h2>Welcome, {user?.college_name || 'College Admin'}!</h2>
                
                {/* College Information Card */}
                <div className="profile-card">
                  <h3>College Information</h3>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <Building size={18} />
                      <div>
                        <label>College Name</label>
                        <span>{user?.college_name || 'Not provided'}</span>
                      </div>
                    </div>
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
                      <MapPin size={18} />
                      <div>
                        <label>Address</label>
                        <span>{user?.address || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={24} color="#FF6B35" />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.totalStudents}</h3>
                      <p>Total Students</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FileText size={24} color="#3b82f6" />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.totalDocuments}</h3>
                      <p>Total Documents</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Clock size={24} color="#f59e0b" />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.pendingDocuments}</h3>
                      <p>Pending Verification</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <CheckCircle size={24} color="#22c55e" />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.verifiedDocuments}</h3>
                      <p>Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="students-tab">
                <h2>Student Management</h2>
                <p>Manage students and their document verification status</p>

                {loading ? (
                  <div className="loading">Loading students...</div>
                ) : (
                  <div className="students-list">
                    {students.map(student => (
                      <div key={student.id} className="student-card">
                        <div className="student-header">
                          <div className="student-info">
                            <div className="student-avatar">
                              <GraduationCap size={24} color="#FF6B35" />
                            </div>
                            <div>
                              <h3>{student.name}</h3>
                              <p>{student.rollNumber} • {student.course}</p>
                              <p className="semester">Semester {student.semester}</p>
                            </div>
                          </div>
                          <div className="student-contact">
                            <p>{student.email}</p>
                          </div>
                        </div>
                        <div className="student-stats">
                          <div className="stat-item">
                            <FileText size={16} />
                            <span>{student.documentsCount} Documents</span>
                          </div>
                          <div className="stat-item">
                            <CheckCircle size={16} color="#22c55e" />
                            <span>{student.verifiedCount} Verified</span>
                          </div>
                          <div className="stat-item">
                            <Clock size={16} color="#f59e0b" />
                            <span>{student.pendingCount} Pending</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="documents-tab">
                <div className="documents-header">
                  <div>
                    <h2>Document Verification</h2>
                    <p>Review and verify student documents</p>
                  </div>
                  <div className="documents-controls">
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Loading documents...</div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} color="#9ca3af" />
                    <h3>No documents found</h3>
                    <p>No documents match your current filter criteria</p>
                  </div>
                ) : (
                  <div className="documents-list">
                    {filteredDocuments.map(doc => (
                      <div key={doc.id} className="document-card">
                        <div className="doc-header">
                          <div className="doc-title">
                            <FileText size={20} />
                            <div>
                              <h3>{doc.title}</h3>
                              <p>{doc.studentName} • {doc.rollNumber}</p>
                            </div>
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
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowVerificationModal(true);
                            }}
                          >
                            <Eye size={16} />
                            {doc.status === 'pending' ? 'Review' : 'View'}
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

      {/* Verification Modal */}
      {showVerificationModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
          <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Document Verification</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="verification-content">
              <div className="document-info">
                <h4>Document Information</h4>
                <div className="info-grid">
                  <div><strong>Student:</strong> {selectedDocument.studentName}</div>
                  <div><strong>Roll Number:</strong> {selectedDocument.rollNumber}</div>
                  <div><strong>Document:</strong> {selectedDocument.title}</div>
                  <div><strong>Type:</strong> {selectedDocument.document_type}</div>
                  <div><strong>Uploaded:</strong> {formatDate(selectedDocument.created_at)}</div>
                  <div><strong>Current Status:</strong> 
                    <span style={{ color: getStatusColor(selectedDocument.status) }}>
                      {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedDocument.status === 'pending' && (
                <div className="verification-actions">
                  <h4>Verification Actions</h4>
                  <div className="action-buttons">
                    <button
                      className="verify-btn approve"
                      onClick={() => handleVerifyDocument(selectedDocument, 'verified', 'Document verified successfully')}
                    >
                      <CheckCircle size={16} />
                      Approve Document
                    </button>
                    <button
                      className="verify-btn reject"
                      onClick={() => handleVerifyDocument(selectedDocument, 'rejected', 'Document rejected due to quality issues')}
                    >
                      <XCircle size={16} />
                      Reject Document
                    </button>
                  </div>
                  <div className="notes-section">
                    <label>Verification Notes (Optional)</label>
                    <textarea
                      placeholder="Add notes about this verification..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {selectedDocument.verification_notes && (
                <div className="existing-notes">
                  <h4>Verification Notes</h4>
                  <p>{selectedDocument.verification_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;