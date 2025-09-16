import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container">
        <div className="logo-section">
          <Shield size={36} />
          <div>
            <h1 className="logo-text">New India Credential Kavach</h1>
            <p className="government-text">Government of Jharkhand</p>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#stats">Stats</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
