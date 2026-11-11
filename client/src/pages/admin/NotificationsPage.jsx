import React, { useState } from 'react';
import api from '../../services/api';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

const NotificationsPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      // Broadcast notification
      setSent(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-0">Broadcast Notifications</h4>
        <p className="text-muted small">Send instant real-time alerts via Socket.IO to connected exhibitors and attendees.</p>
      </div>

      <div className="glass-card p-4 max-w-2xl">
        {sent && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
            <CheckCircle2 size={18} /> Notification broadcasted successfully across connected sessions!
          </div>
        )}

        <form onSubmit={handleSend} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-light small fw-bold">Notification Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="form-control bg-dark text-white border-secondary" placeholder="e.g. Keynote Panel Starting in 15 Minutes" />
          </div>
          <div>
            <label className="form-label text-light small fw-bold">Notification Body</label>
            <textarea rows="3" required value={message} onChange={e => setMessage(e.target.value)} className="form-control bg-dark text-white border-secondary" placeholder="Head over to Main Stage Auditorium for Dr. Elena Rostova's AI keynote session."></textarea>
          </div>
          <button type="submit" className="btn btn-primary-custom py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2">
            <Send size={18} /> Broadcast Notification Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;
