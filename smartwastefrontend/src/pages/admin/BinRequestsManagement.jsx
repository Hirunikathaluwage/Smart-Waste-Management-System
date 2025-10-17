import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/AdminDashboardLayout";
import {
  BarChart3,
  Package,
  Truck,
  Trash2,
  LineChart,
  Check,
  X,
} from "lucide-react";
import axios from "axios";

const BinRequestsManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeNav, setActiveNav] = useState("bins");
  const [statusFilter, setStatusFilter] = useState("all");
  const [binRequests, setBinRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE = "http://localhost:8080/api/admin/bins";

  // Sidebar navigation items
  const navItems = [
    { id: "reports", label: "Generate Reports", icon: BarChart3 },
    { id: "pickups", label: "Special Pickups", icon: Package },
    { id: "routes", label: "Route Changes", icon: Truck },
    { id: "bins", label: "Bin Requests", icon: Trash2 },
    { id: "analytics", label: "Analytics", icon: LineChart },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Pending: { bg: "#fef3c7", color: "#d97706", text: "Pending" },
      Approved: { bg: "#d1fae5", color: "#059669", text: "Approved" },
      Declined: { bg: "#fee2e2", color: "#dc2626", text: "Declined" },
    };
    return styles[status] || styles.Pending;
  };

  // ✅ Fetch all bin requests from backend
  const fetchBins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setBinRequests(res.data);
    } catch (err) {
      console.error("Error fetching bins:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optimistic update for bin status
  const updateStatus = async (id, newStatus) => {
    try {
      // Update UI immediately
      setBinRequests((prev) =>
        prev.map((bin) => (bin.id === id ? { ...bin, status: newStatus } : bin))
      );

      // Then call backend
      await axios.put(`${API_BASE}/${id}/status`, null, {
        params: { status: newStatus },
      });

      // Optional re-fetch to ensure sync
      fetchBins();
    } catch (err) {
      console.error(`Error updating status for ${id}:`, err);
    }
  };

  // ✅ Delete bin request
  const deleteBin = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setBinRequests((prev) => prev.filter((bin) => bin.id !== id));
    } catch (err) {
      console.error(`Error deleting bin ${id}:`, err);
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchBins();
  }, []);

  const filteredRequests =
    statusFilter === "all"
      ? binRequests
      : binRequests.filter(
          (req) => req.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (navId === "reports") navigate("/admin/dashboard");
    else if (navId === "bins") navigate("/admin/bins");
    else if (navId === "pickups") navigate("/admin/pickups");
    else if (navId === "analytics") navigate("/admin/analytics");
  };

  const handleLogout = () => logout();

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav={activeNav}
      onNavClick={handleNavClick}
      logo="Admin"
      user={user}
      onLogout={handleLogout}
      pageTitle="Bin Requests Management"
      pageSubtitle="Manage bin approvals, rejections, and history"
    >
      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Section */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredRequests.length} requests found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Owner", "Address", "Status", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests.map((req) => {
                  const style = getStatusStyle(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {req.binId || "—"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {req.ownerId || "—"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {req.address || "—"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: style.bg,
                            color: style.color,
                          }}
                        >
                          {style.text}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {req.status === "Pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(req.id, "Approved")}
                                className="text-green-600 hover:text-green-700"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => updateStatus(req.id, "Declined")}
                                className="text-red-600 hover:text-red-700"
                                title="Decline"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}

                          {req.status === "Approved" && (
                            <span className="text-green-700 font-medium text-sm flex items-center">
                              <Check className="w-4 h-4 mr-1" /> Approved
                            </span>
                          )}

                          {req.status === "Declined" && (
                            <span className="text-red-700 font-medium text-sm flex items-center">
                              <X className="w-4 h-4 mr-1" /> Declined
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BinRequestsManagement;
