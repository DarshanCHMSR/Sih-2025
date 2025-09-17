import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DocumentBlocks.css';

function DocumentBlocks() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        setDocuments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching documents:', err);
        setDocuments([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign:'center',marginTop:'2rem'}}>Loading...</div>;

  return (
    <div className="doc-blocks-container">
      {documents.map((doc, idx) => (
        <div key={doc.id} className="doc-block">
          <div className="doc-block-id">{doc.id}</div>
          <div className="doc-block-name">{doc.name}</div>
          <Link to={doc.link} className="doc-block-link">View</Link>
          {idx < documents.length - 1 && <div className="doc-block-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

export default DocumentBlocks;
