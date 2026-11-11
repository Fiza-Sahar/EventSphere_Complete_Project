import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, Box, Layers, BarChart3, 
  Bell, Settings, FileText, MessageSquare, Heart, Bookmark, UserCheck, Sparkles, MapPin, Building
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/expos', label: 'Expo Management', icon: Calendar },
    { to: '/admin/exhibitors', label: 'Exhibitors', icon: Building },
    { to: '/admin/attendees', label: 'Attendees', icon: Users },
    { to: '/admin/booths', label: 'Booth Management', icon: Box },
    { to: '/admin/builder', label: '3D Floor Builder', icon: MapPin },
    { to: '/admin/schedule', label: 'Schedule', icon: Calendar },
    { to: '/admin/speakers', label: 'Speakers', icon: UserCheck },
    { to: '/admin/analytics', label: 'AI Analytics & Reports', icon: BarChart3 },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell }
  ];

  const exhibitorLinks = [
    { to: '/exhibitor', label: 'Overview', icon: LayoutDashboard },
    { to: '/exhibitor/booth', label: 'Assigned 3D Booth', icon: Box },
    { to: '/exhibitor/profile', label: 'Company Profile', icon: Layers },
    { to: '/exhibitor/products', label: 'Products & Services', icon: FileText },
    { to: '/exhibitor/messages', label: 'Messages', icon: MessageSquare }
  ];

  const attendeeLinks = [
    { to: '/attendee', label: 'Overview', icon: LayoutDashboard },
    { to: '/attendee/events', label: 'My Events & Tickets', icon: Calendar },
    { to: '/attendee/schedule', label: 'My Saved Schedule', icon: Bookmark },
    { to: '/attendee/favorites', label: 'Favorite Exhibitors', icon: Heart },
    { to: '/attendee/messages', label: 'Messages', icon: MessageSquare }
  ];

  const links = role === 'admin' ? adminLinks : role === 'exhibitor' ? exhibitorLinks : attendeeLinks;

  return (
    <div className="glass-card h-100 p-3 d-flex flex-column gap-2" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="px-3 py-2 text-uppercase text-muted fw-bold small">
        {role} Workspace
      </div>
      {links.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.to}
            end={item.to === '/admin' || item.to === '/exhibitor' || item.to === '/attendee'}
            className={({ isActive }) => 
              `d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none fw-medium transition-all ${
                isActive 
                  ? 'btn-primary-custom shadow-sm' 
                  : 'btn-outline-custom text-start'
              }`
            }
            style={{ border: 'none' }}
          >
            {IconComponent && <IconComponent size={18} />}
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
