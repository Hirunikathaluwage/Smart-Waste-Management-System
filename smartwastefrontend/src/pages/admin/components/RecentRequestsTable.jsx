import { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

const RecentRequestsTable = ({ navigate }) => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080/api/admin/bins";

  // ✅ Status color mapping
  const getStatusStyle = (status) => {
    const map = {
      Pending: { bg: "#fef3c7", color: "#d97706" },
      Approved: { bg: "#d1fae5", color: "#059669" },
      Declined: { bg: "#fee2e2", color: "#dc2626" },
    };
    return map[status] || map.Pending;
  };

  // ✅ Fetch latest bin requests
  const fetchRecentRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      // Sort newest first and take top 5
      const sorted = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentRequests(sorted);
    } catch (err) {
      console.error("Error fetching recent requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve / Decline instantly
  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setRecentRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );

      // Backend call
      await axios.put(`${API_BASE}/${id}/status`, null, {
        params: { status: newStatus },
      });

      // Refresh after update
      fetchRecentRequests();
    } catch (err) {
      console.error(`Error updating status for ${id}:`, err);
    }
  };

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
        <button
          onClick={() => navigate("/admin/bins")}
          className="text-sm font-medium transition-colors"
          style={{ color: "#4CBB17" }}
        >
          View All →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : recentRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent requests found.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Request ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Owner
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Address
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => {
                const style = getStatusStyle(req.status);
                return (
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      #{req.binId || req.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {req.ownerId || "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {req.address || "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                        }}
                      >
                        {style.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {req.status === "Pending" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateStatus(req.id, "Approved")}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, "Declined")}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Decline"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : req.status === "Approved" ? (
                        <span className="text-green-700 text-sm font-medium flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="text-red-700 text-sm font-medium flex items-center">
                          <X className="w-4 h-4 mr-1" /> Declined
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentRequestsTable;
