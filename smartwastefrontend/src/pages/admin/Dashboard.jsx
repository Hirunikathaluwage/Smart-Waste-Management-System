import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/AdminDashboardLayout";
import {
  BarChart3,
  Package,
  Truck,
  Trash2,
  CheckSquare,
  LineChart,
} from "lucide-react";
import AnalyticsView from "./components/AnalyticsView";
import ReportGenerationView from "./components/ReportGenerationView";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Detect view based on path
  const [activeNav, setActiveNav] = useState(
    location.pathname.includes("/analytics") ? "analytics" : "reports"
  );

  useEffect(() => {
    if (location.pathname.includes("/analytics")) setActiveNav("analytics");
    else setActiveNav("reports");
  }, [location.pathname]);

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === "bins") navigate("/admin/bins");
    else if (navId === "pickups") navigate("/admin/pickups");
    else if (navId === "analytics") navigate("/admin/analytics");
    else if (navId === "reports") navigate("/admin/dashboard");
  };

  const navItems = [
    { id: "reports", label: "Generate Reports", icon: BarChart3 },
    { id: "pickups", label: "Special Pickups", icon: Package },
    { id: "routes", label: "Route Changes", icon: Truck },
    { id: "bins", label: "Bin Requests", icon: Trash2 },
    { id: "analytics", label: "Analytics", icon: LineChart },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={logout}
      pageTitle={
        activeNav === "analytics" ? "Analytics Dashboards" : "Generate Reports"
      }
      pageSubtitle={
        activeNav === "analytics"
          ? "Access comprehensive analytics and reporting tools"
          : "Create comprehensive reports and analyze waste management data"
      }
    >
      {activeNav === "analytics" ? <AnalyticsView /> : <ReportGenerationView />}
    </DashboardLayout>
  );
};

export default AdminDashboard;
