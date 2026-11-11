import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const AttendeeMessages = () => {
  const [messages, setMessages] = useState([
    { sender: 'TechCorp Global Booth Rep', text: 'Hi! Thanks for bookmarking Booth A12. How can we assist you with our AI Flagship platform?', time: '09:45 AM' },
    { sender: 'You', text: 'Hi! I would like to schedule a 15-minute live demo at 2:00 PM today.', time: '09:50 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'You', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="d-flex flex-column gap-3" style={{ height: 'calc(100vh - 140px)' }}>
      <div>
        <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Exhibitor Inquiries & Live Chat</h4>
        <p className="text-muted small">Direct real-time channel with booth exhibitors and organizers.</p>
      </div>

      <div className="glass-card flex-grow-1 p-4 d-flex flex-column overflow-hidden">
        <div className="flex-grow-1 overflow-y-auto d-flex flex-column gap-3 mb-3 p-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`d-flex flex-column ${m.sender === 'You' ? 'align-items-end' : 'align-items-start'}`}>
              <span className="small text-muted mb-1">{m.sender} • {m.time}</span>
              <div className={`p-3 rounded-3 max-w-md ${m.sender === 'You' ? 'bg-primary text-white' : 'glass-card border border-secondary'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="d-flex gap-2 border-top border-secondary pt-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask exhibitor a question..."
            className="form-control"
          />
          <button type="submit" className="btn btn-primary-custom px-4 d-flex align-items-center gap-2">
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendeeMessages;
