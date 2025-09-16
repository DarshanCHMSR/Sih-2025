import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, Users, Database, Zap, Award } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-section">
            <Shield size={40} />
            <div>
              <h1 className="logo-text">New India Credential Kavach</h1>
              <p className="government-text">Government of Jharkhand</p>
            </div>
          </div>
          
          <nav>
            <ul className="nav-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">
            Instant Academic Certificate Verification
          </h2>
          <p className="hero-subtitle">
            Secure, transparent, and efficient credential verification system 
            for the digital age - powered by Government of Jharkhand
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/signup" className="btn btn-secondary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-navy mb-4">
              Revolutionizing Credential Verification
            </h3>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              Our advanced platform combines OCR technology, blockchain security, 
              and government backing to ensure authentic credential verification.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card card">
              <FileCheck className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Instant OCR Processing</h4>
              <p className="text-gray">
                Advanced OCR technology automatically extracts and structures data 
                from uploaded certificates and mark sheets with 95%+ accuracy.
              </p>
            </div>

            <div className="feature-card card">
              <Shield className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Government Verified</h4>
              <p className="text-gray">
                Official Government of Jharkhand platform ensuring highest 
                security standards and complete data protection.
              </p>
            </div>

            <div className="feature-card card">
              <Database className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Cross-Reference Database</h4>
              <p className="text-gray">
                Real-time verification against institutional databases to 
                prevent fraud and ensure authenticity.
              </p>
            </div>

            <div className="feature-card card">
              <Users className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Multi-Role Access</h4>
              <p className="text-gray">
                Separate interfaces for students, educational institutions, 
                and government officials with role-based permissions.
              </p>
            </div>

            <div className="feature-card card">
              <Zap className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Lightning Fast</h4>
              <p className="text-gray">
                Get verification results in seconds, not days. Our optimized 
                system processes documents instantly.
              </p>
            </div>

            <div className="feature-card card">
              <Award className="feature-icon mx-auto" size={60} />
              <h4 className="feature-title">Audit Trail</h4>
              <p className="text-gray">
                Complete transparency with detailed audit logs for all 
                verification activities and system access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-light">
        <div className="container text-center">
          <h3 className="text-3xl font-bold text-navy mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray mb-8 max-w-2xl mx-auto">
            Join thousands of students, institutions, and officials who trust 
            New India Credential Kavach for secure credential verification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <h4 className="text-xl font-semibold text-navy mb-2">Students</h4>
              <p className="text-gray mb-4">
                Upload and verify your academic documents instantly
              </p>
              <Link to="/signup?role=student" className="btn btn-primary w-full">
                Student Signup
              </Link>
            </div>

            <div className="card text-center">
              <h4 className="text-xl font-semibold text-navy mb-2">Colleges</h4>
              <p className="text-gray mb-4">
                Verify student credentials and manage institutional records
              </p>
              <Link to="/signup?role=college" className="btn btn-success w-full">
                College Signup
              </Link>
            </div>

            <div className="card text-center">
              <h4 className="text-xl font-semibold text-navy mb-2">Government</h4>
              <p className="text-gray mb-4">
                Administrative access for system oversight and management
              </p>
              <Link to="/signup?role=government" className="btn btn-secondary w-full">
                Government Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-gray">Documents Verified</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray">Registered Institutions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray">System Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield size={32} />
                <div>
                  <h4 className="font-bold">New India Credential Kavach</h4>
                  <p className="text-sm opacity-80">Government of Jharkhand</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Secure digital credential verification platform ensuring 
                authenticity and preventing educational fraud.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signup" className="hover:text-primary">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-primary">Sign In</Link></li>
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#contact" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Government Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="https://jharkhand.gov.in" className="hover:text-primary">Jharkhand Government</a></li>
                <li><a href="https://digitalindia.gov.in" className="hover:text-primary">Digital India</a></li>
                <li><a href="#privacy" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-sm opacity-80">
              © 2025 Government of Jharkhand. All rights reserved. 
              Built for Digital India Initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;