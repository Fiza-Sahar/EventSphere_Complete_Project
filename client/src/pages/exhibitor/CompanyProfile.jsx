import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, Building2, Globe, Mail, Phone } from 'lucide-react';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    companyName: user?.company || 'TechCorp Global',
    category: 'Artificial Intelligence',
    website: 'https://techcorpglobal.com',
    contactEmail: user?.email || 'contact@techcorpglobal.com',
    contactPhone: '+1 (555) 019-1000',
    description: 'TechCorp Global is a premier provider of high-performance enterprise AI solutions, autonomous robotics integration, and neural acceleration hardware.'
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Company Profile Management</h4>
        <p className="text-muted small">Update your corporate showcase profile visible on the public Exhibitor Directory.</p>
      </div>

      <div className="glass-card p-4 max-w-2xl">
        {saved && <div className="alert alert-success small mb-3">Company profile successfully saved!</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Company Name</label>
              <input type="text" value={profile.companyName} onChange={e => setProfile({...profile, companyName: e.target.value})} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Industry Category</label>
              <input type="text" value={profile.category} onChange={e => setProfile({...profile, category: e.target.value})} className="form-control" />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Website URL</label>
              <input type="text" value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Contact Email</label>
              <input type="email" value={profile.contactEmail} onChange={e => setProfile({...profile, contactEmail: e.target.value})} className="form-control" />
            </div>
          </div>

          <div>
            <label className="form-label small fw-bold">Company Overview Description</label>
            <textarea rows="4" value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})} className="form-control"></textarea>
          </div>

          <button type="submit" className="btn btn-primary-custom py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2">
            <Save size={18} /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
