import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import StudentDashboard from './pages/StudentDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import NotFound from './pages/NotFound';

function OnboardingRoute() {
  const { role } = useParams<{ role: string }>();
  if (role !== 'student' && role !== 'university') return <Navigate to="/" replace />;
  return <OnboardingPage role={role} />;
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding/:role" element={<OnboardingRoute />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/university/dashboard" element={<UniversityDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
