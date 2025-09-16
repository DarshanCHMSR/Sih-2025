import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { apiService } from '../services/api';
import { Shield, Upload, FileText, Download, Eye, LogOut, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getDocuments();
      setDocuments(response.documents || []);
    } catch (error) {
      toast.error('Failed to load documents');
      console.error('Load documents error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error('Please select a valid file');
      return;
    }

    const file = acceptedFiles[0];
    const maxSize = 16 * 1024 * 1024; // 16MB

    if (file.size > maxSize) {
      toast.error('File size must be less than 16MB');
      return;
    }

    setUploadingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);

      await apiService.uploadDocument(formData);
      toast.success('Document uploaded successfully!');
      setShowUploadModal(false);
      loadDocuments(); // Reload documents list
    } catch (error) {
      toast.error(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploadingFile
  });

  const handleViewDocument = async (doc) => {
    try {
      const response = await apiService.getDocument(doc.id);
      setSelectedDocument(response);
      setShowDocumentModal(true);
    } catch (error) {
      toast.error('Failed to load document details');
    }
  };

  const handleDownload = async (doc) => {
    try {
      await apiService.downloadFile(doc.id, doc.original_filename);
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-badge status-pending',
      'verified': 'status-badge status-verified',
      'rejected': 'status-badge status-rejected'
    };

    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <Shield size={32} />
            <div>
              <h1 className="text-lg font-bold">Student Dashboard</h1>
              <p className="text-sm opacity-90">New India Credential Kavach</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs opacity-80">Student Account</p>
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
            Welcome, {user?.name || 'Student'}!
          </h2>
          <p className="text-gray">
            Manage your academic documents and track verification status.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <FileText className="mx-auto text-primary mb-2" size={32} />
            <div className="text-2xl font-bold text-navy">{documents.length}</div>
            <div className="text-sm text-gray">Total Documents</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success">
              {documents.filter(doc => doc.verification_status === 'verified').length}
            </div>
            <div className="text-sm text-gray">Verified</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(doc => doc.verification_status === 'pending').length}
            </div>
            <div className="text-sm text-gray">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(doc => doc.verification_status === 'rejected').length}
            </div>
            <div className="text-sm text-gray">Rejected</div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title mb-0">Your Documents</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Upload Document
            </button>
          </div>

          {/* Documents Table */}
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray mb-4" size={48} />
              <h4 className="text-lg font-medium text-navy mb-2">No Documents Yet</h4>
              <p className="text-gray mb-4">
                Upload your first academic document to get started with verification.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-primary"
              >
                <Upload size={20} />
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Upload Date</th>
                    <th>Status</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-primary" />
                          <div>
                            <div className="font-medium">{doc.original_filename}</div>
                            <div className="text-sm text-gray">{doc.mime_type}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {format(new Date(doc.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td>
                        {getStatusBadge(doc.verification_status)}
                      </td>
                      <td>
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="btn btn-outline text-xs py-1 px-3"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="btn btn-primary text-xs py-1 px-3"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Information Card */}
        <div className="card">
          <h3 className="card-title">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Name</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Email</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.email}
              </div>
            </div>
            <div>
              <label className="form-label">Enrollment Number</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.enrollment_number || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Institution</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.institution || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Program</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.program || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="form-label">Semester</label>
              <div className="form-input bg-gray-50 cursor-not-allowed">
                {user?.semester ? `Semester ${user.semester}` : 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-navy mb-4">Upload Document</h3>
            
            <div
              {...getRootProps()}
              className={`file-upload-area ${isDragActive ? 'drag-active' : ''} ${
                uploadingFile ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="text-gray mx-auto mb-4" />
              {uploadingFile ? (
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-2"></div>
                  <p className="text-gray">Processing your document...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-navy font-medium mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop your document'}
                  </p>
                  <p className="text-gray mb-4">or click to browse files</p>
                  <div className="text-sm text-gray">
                    <p>Supported formats: PNG, JPG, JPEG, PDF, TIFF, BMP</p>
                    <p>Maximum size: 16MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn btn-outline flex-1"
                disabled={uploadingFile}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowDocumentModal(false)}>
          <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy">Document Details</h3>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray hover:text-navy"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-navy mb-3">File Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Filename:</strong> {selectedDocument.original_filename}</div>
                  <div><strong>Size:</strong> {formatFileSize(selectedDocument.file_size)}</div>
                  <div><strong>Type:</strong> {selectedDocument.mime_type}</div>
                  <div><strong>Uploaded:</strong> {format(new Date(selectedDocument.created_at), 'PPpp')}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedDocument.verification_status)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-navy mb-3">Verification</h4>
                {selectedDocument.verified_by && (
                  <div className="text-sm">
                    <div><strong>Verified By:</strong> {selectedDocument.verified_by_name}</div>
                    <div><strong>Verification Date:</strong> {format(new Date(selectedDocument.verified_at), 'PPpp')}</div>
                  </div>
                )}
                {selectedDocument.verification_notes && (
                  <div className="mt-3">
                    <strong>Notes:</strong>
                    <div className="mt-1 p-3 bg-light rounded text-sm">
                      {selectedDocument.verification_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedDocument.ocr_extracted_data && (
              <div className="mt-6">
                <h4 className="font-medium text-navy mb-3">Extracted Information</h4>
                <div className="bg-light p-4 rounded-lg">
                  <pre className="text-sm overflow-auto max-h-64">
                    {JSON.stringify(selectedDocument.ocr_extracted_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="btn btn-primary"
              >
                <Download size={20} />
                Download
              </button>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="btn btn-outline"
              >
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