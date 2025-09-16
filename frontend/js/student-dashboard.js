// Student Dashboard JavaScript for New India Credential Kavach

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication and load user data
    const authData = window.CredentialKavach.getAuthData();
    
    if (!authData || authData.user.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name in dashboard
    document.getElementById('studentName').textContent = authData.user.full_name;
    document.getElementById('userName').textContent = authData.user.full_name;
    
    // Load initial data
    loadDocuments();
    loadVerificationStatus();
    
    // Setup file upload for modal
    window.CredentialKavach.setupFileUpload('documentFile', 'documentFile');
    
    // Setup upload form
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', handleDocumentUpload);
});

async function loadDocuments() {
    try {
        const response = await window.CredentialKavach.makeAPIRequest('/documents');
        const documents = response.documents || [];
        
        const documentsList = document.getElementById('documentsList');
        
        if (documents.length === 0) {
            documentsList.innerHTML = '<p style="text-align: center; color: #666;">No documents uploaded yet</p>';
            return;
        }
        
        let html = '';
        documents.forEach(doc => {
            const statusClass = getStatusClass(doc.status);
            const formatFileSize = (bytes) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            };
            
            html += `
                <div class="document-item">
                    <div class="document-info">
                        <h4>${doc.title}</h4>
                        <p><strong>Type:</strong> ${doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)}</p>
                        <p><strong>Size:</strong> ${formatFileSize(doc.file_size || 0)}</p>
                        <p><strong>Uploaded:</strong> ${new Date(doc.created_at).toLocaleDateString()}</p>
                        <span class="status-badge ${statusClass}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                    </div>
                    <div class="document-actions">
                        <button class="btn btn-sm btn-secondary" onclick="viewDocument('${doc.id}')">View</button>
                        <button class="btn btn-sm btn-primary" onclick="downloadDocument('${doc.id}')">Download</button>
                    </div>
                </div>
            `;
        });
        
        documentsList.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load documents:', error);
        window.CredentialKavach.showAlert('Failed to load documents', 'error');
    }
}

async function loadVerificationStatus() {
    try {
        const response = await window.CredentialKavach.makeAPIRequest('/stats');
        const stats = response.stats || {};
        
        const statusContainer = document.getElementById('verificationStatus');
        
        const html = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--success-color);">${stats.verified_documents || 0}</div>
                    <div style="font-size: 0.9rem; color: #666;">Verified</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--warning-color);">${stats.pending_documents || 0}</div>
                    <div style="font-size: 0.9rem; color: #666;">Pending</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${stats.total_documents || 0}</div>
                    <div style="font-size: 0.9rem; color: #666;">Total</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: bold; color: var(--error-color);">${stats.rejected_documents || 0}</div>
                    <div style="font-size: 0.9rem; color: #666;">Rejected</div>
                </div>
            </div>
        `;
        
        statusContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load verification status:', error);
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'verified': return 'status-approved';
        case 'pending': return 'status-pending';
        case 'rejected': return 'status-rejected';
        default: return 'status-pending';
    }
}

function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'flex';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('uploadForm').reset();
}

async function handleDocumentUpload(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!window.CredentialKavach.validateForm(form)) {
        return;
    }
    
    const formData = new FormData(form);
    const file = formData.get('documentFile');
    
    if (!file || file.size === 0) {
        window.CredentialKavach.showAlert('Please select a file to upload', 'error');
        return;
    }
    
    // Set title if not provided
    if (!formData.get('title')) {
        formData.set('title', file.name);
    }
    
    window.CredentialKavach.showLoading(submitBtn, true);
    
    try {
        const response = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.CredentialKavach.getAuthData().token}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Upload failed');
        }
        
        window.CredentialKavach.showAlert('Document uploaded successfully!', 'success');
        closeUploadModal();
        
        // Reload documents and status
        await loadDocuments();
        await loadVerificationStatus();
        
    } catch (error) {
        window.CredentialKavach.showAlert(error.message || 'Upload failed', 'error');
    } finally {
        window.CredentialKavach.showLoading(submitBtn, false);
    }
}

async function viewDocument(documentId) {
    try {
        const response = await window.CredentialKavach.makeAPIRequest(`/documents/${documentId}`);
        const document = response.document;
        
        // Create a simple modal to show document details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const ocrDataHtml = document.ocr_data ? `
            <div style="margin-top: 1rem;">
                <h4>OCR Extracted Data:</h4>
                <pre style="background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto;">${JSON.stringify(document.ocr_data, null, 2)}</pre>
            </div>
        ` : '';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Document Details</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div style="padding: 2rem;">
                    <p><strong>Title:</strong> ${document.title}</p>
                    <p><strong>Type:</strong> ${document.document_type}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(document.status)}">${document.status}</span></p>
                    <p><strong>Uploaded:</strong> ${new Date(document.created_at).toLocaleDateString()}</p>
                    ${document.description ? `<p><strong>Description:</strong> ${document.description}</p>` : ''}
                    ${document.verification_notes ? `<p><strong>Verification Notes:</strong> ${document.verification_notes}</p>` : ''}
                    ${ocrDataHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
    } catch (error) {
        window.CredentialKavach.showAlert('Failed to load document details', 'error');
    }
}

async function downloadDocument(documentId) {
    try {
        const token = window.CredentialKavach.getAuthData().token;
        const url = `/api/documents/${documentId}/download`;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        link.style.display = 'none';
        
        // Add authorization header by fetching first then creating blob URL
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
    } catch (error) {
        window.CredentialKavach.showAlert('Failed to download document', 'error');
    }
}

async function generateShareLink() {
    try {
        // This would generate a shareable link for verified credentials
        window.CredentialKavach.showAlert('Share link feature coming soon!', 'warning');
    } catch (error) {
        window.CredentialKavach.showAlert('Failed to generate share link', 'error');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.CredentialKavach.clearAuthData();
        window.location.href = 'index.html';
    }
}