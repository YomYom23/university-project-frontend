import {Navigate, Route, useParams, Routes, BrowserRouter} from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage.tsx';
import OnboardingPage from './pages/OnboardingPage';
import StudentDashboard from './pages/StudentDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import NotFound from './pages/NotFound';
import {AuthProvider} from "./auth/AuthProvider.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

function OnboardingRoute() {
    const {role} = useParams<{ role: string }>();
    if (role !== 'student' && role !== 'university') return <Navigate to="/" replace/>;
    return <OnboardingPage role={role}/>;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />}/>
                        <Route path="/signup" element={<SignupPage />}/>
                        <Route path="/login" element={<SigninPage />}/>
                        <Route path="*" element={<NotFound/>}/>

                        {/* Private Routes — guarded by <ProtectedRoute> */}
                        <Route
                            path="/onboarding/:role"
                            element={
                                <ProtectedRoute>
                                    <OnboardingRoute />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student/dashboard"
                            element={
                                <ProtectedRoute>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/university/dashboard"
                            element={
                                <ProtectedRoute>
                                    <UniversityDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </AuthProvider>
        </BrowserRouter>
    );
}
