import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const DocumentVerification = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    loadVerificationHistory();
  }, []);

  const loadVerificationHistory = async () => {
    try {
      // This would be an API call to get employer's verification history
      // For now, we'll use mock data
      setVerificationHistory([
        {
          id: '1',
          student_email: 'student1@example.com',
          document_type: 'marks_card',
          verified_at: '2025-09-17T10:30:00Z',
          status: 'verified',
          confidence_score: 95
        },
        {
          id: '2',
          student_email: 'student2@example.com',
          document_type: 'degree_certificate',
          verified_at: '2025-09-16T14:15:00Z',
          status: 'suspicious',
          confidence_score: 65
        }
      ]);
    } catch (error) {
      console.error('Error loading verification history:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter a student email address');
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiService.verifyStudentDocument({
        student_email: searchEmail,
        document_type: 'marks_card'
      });
      
      setSearchResult(response);
      
      if (response.verified) {
        toast.success('Student documents found and verified!');
      } else {
        toast.warning('Student not found or documents unavailable');
      }
    } catch (error) {
      toast.error('Search failed: ' + error.message);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerificationAction = async (action, documentId, notes = '') => {
    try {
      const response = await apiService.submitVerification({
        document_id: documentId,
        verification_status: action,
        notes: notes,
        confidence_score: searchResult?.confidence_score || 0
      });
      
      toast.success(`Document ${action} successfully!`);
      
      // Refresh history
      loadVerificationHistory();
      
      // Clear current search
      setSearchResult(null);
      setSearchEmail('');
    } catch (error) {
      toast.error('Verification action failed: ' + error.message);
    }
  };

  const getStatusBadge = (status, score) => {
    if (status === 'verified' || score >= 90) {
      return (
        <span className="status-badge status-success flex items-center gap-1">
          <CheckCircle2 size={16} />
          Verified
        </span>
      );
    } else if (status === 'rejected' || score < 50) {
      return (
        <span className="status-badge status-error flex items-center gap-1">
          <XCircle size={16} />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="status-badge status-warning flex items-center gap-1">
          <AlertTriangle size={16} />
          Suspicious
        </span>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Document Verification</h2>
          <p className="card-subtitle">
            Verify student documents for recruitment and employment purposes
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Search Student Documents</h3>
        </div>
        <div className="card-body">
          <div className="flex gap-4 items-end">
            <div className="form-group flex-1">
              <label className="form-label">Student Email Address</label>
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="form-input"
                placeholder="Enter student's email address"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn btn-primary flex items-center gap-2"
            >
              <Search size={16} />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResult && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Verification Results</h3>
          </div>
          <div className="card-body">
            {searchResult.verified ? (
              <div className="space-y-4">
                {/* Student Info */}
                <div className="bg-light rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student Name</label>
                      <p className="text-gray-900">{searchResult.student_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{searchResult.student_email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Verification Status</label>
                      {getStatusBadge(searchResult.status, searchResult.confidence_score)}
                    </div>
                  </div>
                </div>

                {/* Document Details */}
                {searchResult.documents && searchResult.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Available Documents</h4>
                    <div className="space-y-3">
                      {searchResult.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="text-primary" size={20} />
                              <div>
                                <h5 className="font-medium">{doc.title}</h5>
                                <p className="text-sm text-gray-600">{doc.document_type}</p>
                              </div>
                            </div>
                            {getStatusBadge(doc.status, doc.confidence_score || 0)}
                          </div>

                          {doc.ocr_data && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                              {doc.ocr_data.roll_number && (
                                <div>
                                  <span className="font-medium">Roll No:</span> {doc.ocr_data.roll_number}
                                </div>
                              )}
                              {doc.ocr_data.college_name && (
                                <div>
                                  <span className="font-medium">College:</span> {doc.ocr_data.college_name}
                                </div>
                              )}
                              {doc.ocr_data.percentage && (
                                <div>
                                  <span className="font-medium">Percentage:</span> {doc.ocr_data.percentage}%
                                </div>
                              )}
                              {doc.ocr_data.year && (
                                <div>
                                  <span className="font-medium">Year:</span> {doc.ocr_data.year}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Fraud Indicators */}
                          {searchResult.fraud_indicators && searchResult.fraud_indicators.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                              <h6 className="font-medium text-yellow-800 mb-1">Fraud Indicators Detected:</h6>
                              <ul className="text-sm text-yellow-700">
                                {searchResult.fraud_indicators.map((indicator, i) => (
                                  <li key={i}>• {indicator}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Confidence Score */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Confidence Score</span>
                              <span>{searchResult.confidence_score || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  (searchResult.confidence_score || 0) >= 90
                                    ? 'bg-green-500'
                                    : (searchResult.confidence_score || 0) >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${searchResult.confidence_score || 0}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerificationAction('verified', doc.id, 'Document verified for employment')}
                              className="btn btn-success btn-sm"
                            >
                              <CheckCircle2 size={16} />
                              Verify Document
                            </button>
                            <button
                              onClick={() => handleVerificationAction('rejected', doc.id, 'Document rejected due to inconsistencies')}
                              className="btn btn-error btn-sm"
                            >
                              <XCircle size={16} />
                              Reject Document
                            </button>
                            <button
                              onClick={() => setSelectedDocument(doc)}
                              className="btn btn-outline btn-sm"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h4 className="text-lg font-semibold mb-2">No Documents Found</h4>
                <p className="text-gray-600">
                  {searchResult.message || 'No verified documents found for this student email.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification History */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Recent Verifications</h3>
        </div>
        <div className="card-body">
          {verificationHistory.length > 0 ? (
            <div className="space-y-3">
              {verificationHistory.map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{record.student_email}</p>
                    <p className="text-sm text-gray-600">
                      {record.document_type} • {new Date(record.verified_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(record.status, record.confidence_score)}
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {record.confidence_score}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto mb-4" size={48} />
              <p>No verification history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;