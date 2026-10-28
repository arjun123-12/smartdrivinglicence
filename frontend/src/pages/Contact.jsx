import React, { useState } from 'react';
import api from '../services/api';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Booking Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.post('/contact', formData);
      setSuccessMessage(res.data.message || 'Thank you! Your enquiry has been received.');
      setFormData({ name: '', email: '', phone: '', subject: 'Booking Enquiry', message: '' });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            We're Here to Help
          </span>
          <h1>Contact SmartDriving South Australia</h1>
          <p>
            Have questions about VORT testing regulations, booking a package, or test hub availability? Reach out to our Adelaide support team.
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
          {/* Contact Details */}
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
              Get in Touch
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Our booking team is available Monday to Saturday to assist with instructor scheduling, overseas licence conversions, and VORT test preparation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Phone Support
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                    (08) 8234 5678 / +61 412 345 678
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Email Enquiries
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                    support@smartdriving.com.au
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Adelaide Head Office
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
                    120 King William Street, Adelaide SA 5000
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Support Hours
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
                    Mon - Fri: 8:00 AM – 6:00 PM | Sat: 8:30 AM – 3:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Send Us a Message</h3>

            {successMessage && (
              <div className="alert alert-success">
                <CheckCircle size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0412 345 678"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Enquiry Topic</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Booking Enquiry">VORT Test Booking Enquiry</option>
                  <option value="Lesson Package">Driving Lesson Package Question</option>
                  <option value="Overseas Conversion">Overseas Licence Conversion</option>
                  <option value="Rescheduling">Reschedule Existing Booking</option>
                  <option value="General">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you need help with..."
                />
              </div>

              <button type="submit" disabled={loading} className="button button-primary button-full button-lg">
                <Send size={18} /> {loading ? 'Sending Enquiry...' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

