import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ResidentDashboard from './pages/resident/Dashboard';
import WorkerDashboard from './pages/worker/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import { ROLES } from './constants/roles';

/**
 * App Component - Main application component
 * Follows Dependency Inversion - components depend on AuthProvider abstraction
 * Follows Open/Closed - easy to add new routes without modifying existing code
 */
function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Header />

                    <div className="flex-1">
                        <Routes>
                            {/* Public Pages */}
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signin" element={<SignIn />} />

                            {/* Protected Role-Based Dashboards */}
                            <Route 
                                path="/resident/dashboard" 
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                                        <ResidentDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/worker/dashboard" 
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
                                        <WorkerDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/admin/dashboard" 
                                element={
                                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } 
                            />

                            {/* Redirect unknown paths */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>

                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;




