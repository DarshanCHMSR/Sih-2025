import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './EmployerDashboard.css';

function EmployerDashboard() {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [documentType, setDocumentType] = useState('marks_card');

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!studentEmail.trim()) {
      toast.error('Please enter student email');
      return;
    }

    setLoading(true);
    setVerificationData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_email: studentEmail,
          document_type: documentType
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setVerificationData(data);
        
        if (data.verified) {
          toast.success('Document verified successfully!');
        } else if (data.status === 'FRAUD_DETECTED') {
          toast.error('Fraud detected in document!');
        } else {
          toast.warning('Document verification inconclusive');
        }
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify document');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return '#22c55e';
      case 'FRAUD_DETECTED': return '#ef4444';
      case 'PENDING_VERIFICATION': return '#f59e0b';
      case 'STUDENT_NOT_FOUND': return '#6b7280';
      case 'NO_DOCUMENTS': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <h1>Document Verification Portal</h1>
        <p>Verify student credentials and detect fraudulent documents</p>
      </div>

      <div className="verification-form-container">
        <form onSubmit={handleVerification} className="verification-form">
          <h2>Verify Student Document</h2>
          
          <div className="form-group">
            <label htmlFor="studentEmail">Student Email Address</label>
            <input
              type="email"
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Enter student's registered email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="documentType">Document Type</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="marks_card">Marks Card</option>
              <option value="degree_certificate">Degree Certificate</option>
              <option value="transcript">Transcript</option>
              <option value="character_certificate">Character Certificate</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="verify-btn">
            {loading ? 'Verifying...' : 'Verify Document'}
          </button>
        </form>
      </div>

      {verificationData && (
        <div className="verification-result">
          <div className="result-header">
            <h3>Verification Result</h3>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(verificationData.status) }}
            >
              {verificationData.status.replace('_', ' ')}
            </div>
          </div>

          {verificationData.confidence_score && (
            <div className="confidence-score">
              <span>Confidence Score: </span>
              <span 
                style={{ color: getConfidenceColor(verificationData.confidence_score) }}
                className="score-value"
              >
                {verificationData.confidence_score}%
              </span>
            </div>
          )}

          {verificationData.student_info && (
            <div className="student-info">
              <h4>Student Information</h4>
              <div className="info-grid">
                <div><strong>Name:</strong> {verificationData.student_info.name}</div>
                <div><strong>Email:</strong> {verificationData.student_info.email}</div>
                <div><strong>College:</strong> {verificationData.student_info.college}</div>
                <div><strong>Course:</strong> {verificationData.student_info.course}</div>
                {verificationData.student_info.roll_number && (
                  <div><strong>Roll Number:</strong> {verificationData.student_info.roll_number}</div>
                )}
              </div>
            </div>
          )}

          {verificationData.document_info && (
            <div className="document-info">
              <h4>Document Information</h4>
              <div className="info-grid">
                <div><strong>Title:</strong> {verificationData.document_info.title}</div>
                <div><strong>Upload Date:</strong> {new Date(verificationData.document_info.upload_date).toLocaleDateString()}</div>
                <div><strong>Status:</strong> {verificationData.document_info.status}</div>
                <div><strong>File Size:</strong> {verificationData.document_info.file_size ? `${(verificationData.document_info.file_size / 1024).toFixed(2)} KB` : 'Unknown'}</div>
              </div>
            </div>
          )}

          {verificationData.fraud_indicators && verificationData.fraud_indicators.length > 0 && (
            <div className="fraud-indicators">
              <h4>⚠️ Fraud Indicators Detected</h4>
              <ul>
                {verificationData.fraud_indicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="verification-meta">
            <small>
              Verified on: {new Date(verificationData.verification_timestamp).toLocaleString()}
              {verificationData.verified_by && ` by ${verificationData.verified_by}`}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;