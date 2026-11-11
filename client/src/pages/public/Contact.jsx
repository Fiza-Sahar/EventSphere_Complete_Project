import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-extrabold mb-2" style={{ color: 'var(--heading-color)' }}>
          Contact <span className="text-gradient">EventSphere</span>
        </h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Have questions about organizer subscriptions, exhibitor booth spaces, or technical support? Our concierge team is here to assist.
        </p>
      </div>

      <div className="row g-4 g-lg-5">
        <div className="col-lg-6">
          <div className="glass-card p-4 p-md-5 h-100 shadow-sm">
            <h4 className="fw-bold mb-4" style={{ color: 'var(--heading-color)' }}>Get In Touch</h4>
            {submitted ? (
              <div className="p-4 rounded-3 d-flex align-items-center gap-3 border" style={{ background: 'var(--primary-glow)', borderColor: 'var(--primary-400)' }}>
                <CheckCircle2 size={28} className="text-success flex-shrink-0" />
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Inquiry Transmitted</h6>
                  <small className="text-secondary">Our event relations team will contact you within 24 business hours.</small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Full Name</label>
                  <input type="text" required className="form-control" placeholder="John Doe" />
                </div>
                <div>
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Email Address</label>
                  <input type="email" required className="form-control" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Subject</label>
                  <input type="text" required className="form-control" placeholder="Exhibitor Booth Inquiry" />
                </div>
                <div>
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Message</label>
                  <textarea rows="4" required className="form-control" placeholder="How can we assist your event strategy?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary-custom py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2">
                  <Send size={18} /> Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between shadow-sm">
            <div>
              <h4 className="fw-bold mb-4" style={{ color: 'var(--heading-color)' }}>Global Headquarters</h4>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 rounded-3 flex-shrink-0" style={{ background: 'var(--primary-glow)' }}>
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--heading-color)' }}>Silicon Valley Event Center</div>
                    <div className="text-secondary small">500 Innovation Parkway, San Jose CA 95110</div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 rounded-3 flex-shrink-0" style={{ background: 'var(--primary-glow)' }}>
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--heading-color)' }}>Email Communications</div>
                    <div className="text-secondary small">support@eventsphere.com</div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-3 rounded-3 flex-shrink-0" style={{ background: 'var(--primary-glow)' }}>
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--heading-color)' }}>Direct Telephone</div>
                    <div className="text-secondary small">+1 (800) 555-EXPO (3976)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-3 border mt-4" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Live Event Operational Hours</h6>
              <div className="text-secondary small">Monday – Friday: 8:00 AM – 6:00 PM PST • 24/7 AI Concierge Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
