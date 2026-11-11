import React from 'react';
import { Shield, Sparkles, Layers, Cpu, Globe, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="text-center max-w-3xl mx-auto mb-5">
        <h1 className="fw-extrabold mb-3" style={{ color: 'var(--heading-color)' }}>
          About <span className="text-gradient">EventSphere</span>
        </h1>
        <p className="lead mx-auto text-secondary" style={{ maxWidth: '750px' }}>
          EventSphere is a commercial-grade SaaS platform built to unify trade shows, interactive 3D spatial floor plans, AI matchmaking concierge, and real-time delegate communications into one seamless ecosystem.
        </p>
      </div>

      <div className="row g-4 my-4">
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 text-center shadow-sm">
            <div className="p-3 rounded-circle bg-primary bg-opacity-15 d-inline-block mb-3">
              <Layers className="text-primary" size={32} />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>3D Space Visualization</h5>
            <p className="text-secondary small">
              Interactive WebGL 3D rendering powered by Three.js allows organizers and delegates to tour expo halls in real time with exact spatial positioning and waypoint guidance.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 text-center shadow-sm">
            <div className="p-3 rounded-circle bg-info bg-opacity-15 d-inline-block mb-3">
              <Sparkles className="text-info" size={32} />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>AI Event Intelligence</h5>
            <p className="text-secondary small">
              Contextual AI engine powered by Google Gemini provides instant answers, conflict-free timetable generation, booth locator guides, and organizer metrics analysis.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 text-center shadow-sm">
            <div className="p-3 rounded-circle bg-success bg-opacity-15 d-inline-block mb-3">
              <Globe className="text-success" size={32} />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>Real-Time Synchronicity</h5>
            <p className="text-secondary small">
              Socket.IO integration ensures immediate status propagation across connected client sessions when booth reservations, messaging, or schedule shifts occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
