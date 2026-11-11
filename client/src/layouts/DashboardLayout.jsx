import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AIAssistantModal from '../components/ai/AIAssistantModal';

const DashboardLayout = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-5 text-center text-muted">Authenticating workspace access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      <Navbar />
      <div className="container-fluid flex-grow-1 py-4 px-4">
        <div className="row g-4">
          <div className="col-lg-3 col-xl-2">
            <Sidebar role={user.role} />
          </div>
          <div className="col-lg-9 col-xl-10">
            <div className="glass-card p-4 min-vh-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <AIAssistantModal />
    </div>
  );
};

export default DashboardLayout;
