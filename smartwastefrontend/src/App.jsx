import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import ResidentDashboard from "./pages/resident/Dashboard";
import WorkerDashboard from "./pages/worker/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import BinRequestsManagement from "./pages/admin/BinRequestsManagement";
import BusinessDashboard from "./pages/business/Dashboard";
import BusinessPickupRequestPage from "./pages/business/PickupRequestPage";
import PickupRequestPage from "./pages/pickup/PickupRequestPage";
import AdminPickupDashboard from "./components/admin/AdminPickupDashboard";
import { ROLES } from "./constants/roles";
import WasteCollectionPerformance from "./pages/admin/WasteCollectionPerformance";
import RecyclingTrends from "./pages/admin/RecyclingTrends";
import FinancialSummary from "./pages/admin/FinancialSummary";
import EnvironmentalImpact from "./pages/admin/EnvironmentalImpact";
import SpecialPickupManagement from "./pages/admin/SpecialPickupManagement";
/**
 * Layout wrapper component that conditionally renders Header and Footer
 */
function Layout({ children }) {
  const location = useLocation();

  // Check if current path is a dashboard route
  const isDashboardRoute =
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/resident/") ||
    location.pathname.startsWith("/worker/");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Header on non-dashboard pages */}
      {!isDashboardRoute && <Header />}

      <div className="flex-1">{children}</div>

      {/* Only show Footer on non-dashboard pages */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

/**
 * App Component - Main application component
 * Follows Dependency Inversion - components depend on AuthProvider abstraction
 * Follows Open/Closed - easy to add new routes without modifying existing code
 */
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Layout>
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
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.BUSINESS]}>
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />

            {/* Pickup Request Routes */}
            <Route
              path="/pickup-request"
              element={
                <ProtectedRoute allowedRoles={[ROLES.RESIDENT]}>
                  <PickupRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/pickup-request"
              element={
                <ProtectedRoute allowedRoles={[ROLES.BUSINESS]}>
                  <BusinessPickupRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pickup-management"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminPickupDashboard />
                </ProtectedRoute>
              }
            />

            {/*  Admin - Analytics Page (separate route for analytics dashboard) */}
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin - Bin Requests Management */}
            <Route
              path="/admin/bins"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <BinRequestsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pickups"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <SpecialPickupManagement />
                </ProtectedRoute>
              }
            />

            {/* Admin - Analytics Sub Dashboards */}
            <Route
              path="/admin/performance"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <WasteCollectionPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recycling"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <RecyclingTrends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/financial"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <FinancialSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/environmental"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <EnvironmentalImpact />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
