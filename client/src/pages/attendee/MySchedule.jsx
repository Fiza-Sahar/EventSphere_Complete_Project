import React from 'react';
import { Bookmark, Clock, MapPin, Calendar, Trash2 } from 'lucide-react';

const MySchedule = () => {
  const savedSessions = [
    { _id: 's1', title: 'Keynote: The Future of Generative AI Architectures', date: '2026-09-15', startTime: '10:00 AM', endTime: '11:30 AM', location: 'Main Auditorium', speaker: 'Dr. Elena Rostova' },
    { _id: 's2', title: 'Zero-Trust Cloud Architecture in 2026', date: '2026-09-16', startTime: '01:30 PM', endTime: '03:00 PM', location: 'Conference Room 1', speaker: 'Marcus Vance' },
    { _id: 's3', title: 'Commercializing Quantum Key Distribution', date: '2026-09-17', startTime: '11:00 AM', endTime: '12:30 PM', location: 'Conference Room 2', speaker: 'Sophia Chen' }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>My Saved Timetable</h4>
        <p className="text-muted small">Your personal collision-free keynote and workshop agenda.</p>
      </div>

      <div className="d-flex flex-column gap-3">
        {savedSessions.map((session) => (
          <div key={session._id} className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold  mb-2" style={{ color: "var(--heading-color)" }}>{session.title}</h5>
                <div className="d-flex flex-wrap gap-4 text-muted small">
                  <span className="d-flex align-items-center gap-1"><Clock size={14} className="text-primary" /> {session.startTime} - {session.endTime}</span>
                  <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {session.date}</span>
                  <span className="d-flex align-items-center gap-1"><MapPin size={14} className="text-info" /> {session.location}</span>
                </div>
                <div className="text-muted small mt-2">Speaker: <strong>{session.speaker}</strong></div>
              </div>
              <button className="btn btn-sm btn-outline-danger">
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySchedule;
