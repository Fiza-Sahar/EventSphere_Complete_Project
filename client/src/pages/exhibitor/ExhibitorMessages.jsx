import React, { useState } from 'react';
import { Send, MessageSquare, User, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExhibitorMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { sender: 'Attendee User 1', text: 'Hello! I am visiting your booth A12 later today. Do you have live demos of AI Flagship V2?', time: '10:15 AM' },
    { sender: 'You', text: 'Hi! Yes, our engineering team is conducting live demo sessions every 30 minutes at booth A12.', time: '10:18 AM' }
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
        <h4 className="fw-bold text-white mb-0">Booth Inquiries & Messaging</h4>
        <p className="text-muted small">Communicate in real time with interested event delegates and show organizers.</p>
      </div>

      <div className="glass-card flex-grow-1 p-4 d-flex flex-column overflow-hidden">
        <div className="flex-grow-1 overflow-y-auto d-flex flex-column gap-3 mb-3 p-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`d-flex flex-column ${m.sender === 'You' ? 'align-items-end' : 'align-items-start'}`}>
              <span className="small text-muted mb-1">{m.sender} • {m.time}</span>
              <div className={`p-3 rounded-3 max-w-md ${m.sender === 'You' ? 'bg-primary text-white' : 'bg-dark text-light border border-secondary'}`}>
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
            placeholder="Type your message..."
            className="form-control bg-dark text-white border-secondary"
          />
          <button type="submit" className="btn btn-primary-custom px-4 d-flex align-items-center gap-2">
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExhibitorMessages;
