import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import ExploreExpos from './pages/public/ExploreExpos';
import ExpoDetails from './pages/public/ExpoDetails';
import Exhibitors from './pages/public/Exhibitors';
import Speakers from './pages/public/Speakers';
import ExhibitorDetailPage from './pages/public/ExhibitorDetailPage';
import Schedule from './pages/public/Schedule';
import FloorPlanPage from './pages/public/FloorPlanPage';
import BookBoothPage from './pages/public/BookBoothPage';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Admin Dashboard Pages
import AdminOverview from './pages/admin/AdminOverview';
import ExpoManagement from './pages/admin/ExpoManagement';
import ExhibitorManagement from './pages/admin/ExhibitorManagement';
import AttendeeManagement from './pages/admin/AttendeeManagement';
import BoothManagement from './pages/admin/BoothManagement';
import FloorBuilder3D from './pages/admin/FloorBuilder3D';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import SpeakerManagement from './pages/admin/SpeakerManagement';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import NotificationsPage from './pages/admin/NotificationsPage';

// Exhibitor Dashboard Pages
import ExhibitorOverview from './pages/exhibitor/ExhibitorOverview';
import MyBooths from './pages/exhibitor/MyBooths';
import CompanyProfile from './pages/exhibitor/CompanyProfile';
import ProductsServices from './pages/exhibitor/ProductsServices';
import ExhibitorMessages from './pages/exhibitor/ExhibitorMessages';

// Attendee Dashboard Pages
import AttendeeOverview from './pages/attendee/AttendeeOverview';
import MyEvents from './pages/attendee/MyEvents';
import MySchedule from './pages/attendee/MySchedule';
import FavoriteExhibitors from './pages/attendee/FavoriteExhibitors';
import AttendeeMessages from './pages/attendee/AttendeeMessages';

function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="expos" element={<ExploreExpos />} />
        <Route path="expos/:id" element={<ExpoDetails />} />
        <Route path="exhibitors" element={<Exhibitors />} />
        <Route path="speakers" element={<Speakers />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="floor-plan" element={<FloorPlanPage />} />
        <Route path="book-booth" element={<BookBoothPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="exhibitor/:id" element={<ExhibitorDetailPage />} />
        <Route path="exhibitors/:id" element={<ExhibitorDetailPage />} />
      </Route>


      {/* Admin Dashboard Protected Routes */}
      <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminOverview />} />
        <Route path="expos" element={<ExpoManagement />} />
        <Route path="exhibitors" element={<ExhibitorManagement />} />
        <Route path="attendees" element={<AttendeeManagement />} />
        <Route path="booths" element={<BoothManagement />} />
        <Route path="builder" element={<FloorBuilder3D />} />
        <Route path="schedule" element={<ScheduleManagement />} />
        <Route path="speakers" element={<SpeakerManagement />} />
        <Route path="analytics" element={<AnalyticsReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Exhibitor Dashboard Protected Routes */}
      <Route path="/exhibitor" element={<DashboardLayout role="exhibitor" />}>
        <Route index element={<ExhibitorOverview />} />
        <Route path="booth" element={<MyBooths />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="products" element={<ProductsServices />} />
        <Route path="messages" element={<ExhibitorMessages />} />
      </Route>

      {/* Attendee Dashboard Protected Routes */}
      <Route path="/attendee" element={<DashboardLayout role="attendee" />}>
        <Route index element={<AttendeeOverview />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="favorites" element={<FavoriteExhibitors />} />
        <Route path="messages" element={<AttendeeMessages />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
