import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIAssistantModal from '../components/ai/AIAssistantModal';
import LiveExpoTicker from '../components/ticker/LiveExpoTicker';
import DigitalHologramBadge from '../components/badge/DigitalHologramBadge';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isFloorPlan = location.pathname === '/floor-plan';

  return (
    <div 
      className="min-vh-100 d-flex flex-column" 
      style={{ 
        backgroundColor: 'var(--bg-dark)', 
        color: 'var(--text-main)', 
        paddingBottom: '36px',
        overflowX: 'hidden'
      }}
    >
      <Navbar onOpenBadge={() => setBadgeOpen(true)} />
      <main className="flex-grow-1 d-flex flex-column">
        <Outlet />
      </main>
      {/* Hide large static footer on 3D floor plan for immersive full-screen application experience */}
      {!isFloorPlan && <Footer />}
      
      {/* Floating AI Chatbot Assistant across all pages */}
      <AIAssistantModal />
      {/* Live Broadcast Ticker */}
      <LiveExpoTicker />
      {/* Holographic Digital Pass Modal */}
      <DigitalHologramBadge 
        isOpen={badgeOpen} 
        onClose={() => setBadgeOpen(false)} 
        user={user || { name: 'VIP Guest Delegate', email: 'delegate@eventsphere.com', role: 'attendee' }}
      />
    </div>
  );
};

export default PublicLayout;
