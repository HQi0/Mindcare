import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import MoodTracker from '../pages/MoodTracker.jsx';
import MoodHistory from '../pages/MoodHistory.jsx';
import SelfAssessment from '../pages/SelfAssessment.jsx';
import TakeAssessment from '../pages/TakeAssessment.jsx';
import Resources from '../pages/Resources.jsx';
import ArticleDetail from '../pages/ArticleDetail.jsx';
import CounselorChat from '../pages/CounselorChat.jsx';
import Community from '../pages/Community.jsx';
import BookingSession from '../pages/BookingSession.jsx';
import Settings from '../pages/Settings.jsx';
import EmergencyHelp from '../pages/EmergencyHelp.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood-tracker" element={<MoodTracker />} />
        <Route path="/mood-history" element={<MoodHistory />} />
        <Route path="/self-assessment" element={<SelfAssessment />} />
        <Route path="/self-assessment/:assessmentId" element={<TakeAssessment />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/artikel/:articleId" element={<ArticleDetail />} />
        <Route path="/counselor-chat" element={<CounselorChat />} />
        <Route path="/community" element={<Community />} />
        <Route path="/schedule-session" element={<BookingSession />} />
        <Route path="/profile" element={<Settings />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/emergency-help" element={<EmergencyHelp />} />
      </Route>
    </Routes>
  );
}
