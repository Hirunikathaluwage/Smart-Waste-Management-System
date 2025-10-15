import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Route guard component
 * Follows Single Responsibility Principle - only handles route protection
 * Follows Open/Closed Principle - can be extended with role-based access
 */
const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
