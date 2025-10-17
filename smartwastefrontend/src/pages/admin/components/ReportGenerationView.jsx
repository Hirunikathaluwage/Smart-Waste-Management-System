import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Recycle,
  MapPin,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import StatsGrid from "./StatsGrid";
import RecentRequestsTable from "./RecentRequestsTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReportGenerationView = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("waste-trends");
  const [area, setArea] = useState("all-areas");
  const [dateRange, setDateRange] = useState("");
  const [selectedWasteTypes, setSelectedWasteTypes] = useState({
    general: false,
    recyclables: false,
    organic: false,
    hazardous: false,
  });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/reports/all"
      );
      setReports(res.data);
    } catch (err) {
      console.error("❌ Error loading reports:", err);
    }
  };

  const handleWasteTypeChange = (type) =>
    setSelectedWasteTypes((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleGenerateReport = async () => {
    const payload = { reportType, area, dateRange, selectedWasteTypes };
    console.log("📤 Sending report payload:", payload);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/reports/generate",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(
        `✅ Report Generated!\nType: ${res.data.reportType}\nArea: ${
          res.data.area
        }\nRecycling Rate: ${res.data.recyclingRate.toFixed(2)}%`
      );

      loadReports();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("❌ Failed to generate report. Check backend connection.");
    }
  };

  const handleViewPdf = (id) => {
    const pdfUrl = `http://localhost:8080/api/admin/reports/pdf/${id}`;
    window.open(pdfUrl, "_blank");
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/reports/${id}`);
        alert("✅ Report deleted successfully!");
        loadReports(); // Refresh the table
      } catch (error) {
        console.error("Error deleting report:", error);
        alert("❌ Failed to delete report. Check backend connection.");
      }
    }
  };

  const statistics = [
    {
      id: "total-waste",
      label: "Total Waste",
      value: "2,847 kg",
      change: "+12% from last month",
      icon: TrendingUp,
      iconColor: "#4CBB17",
    },
    {
      id: "recycling-rate",
      label: "Recycling Rate",
      value: "68%",
      change: "+6% improvement",
      icon: Recycle,
      iconColor: "#3b82f6",
    },
    {
      id: "routes-active",
      label: "Routes Active",
      value: "24",
      change: "2 optimized",
      icon: MapPin,
      iconColor: "#f59e0b",
    },
    {
      id: "waste-zones",
      label: "High Waste Zones",
      value: "7",
      change: "Requires attention",
      icon: AlertCircle,
      iconColor: "#ef4444",
    },
  ];

  return (
    <>
      {/* Report Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: "#4CBB17" }} />
          Generate New Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="waste-trends">Waste Trends</option>
              <option value="collection-routes">Collection Routes</option>
              <option value="revenue-analysis">Revenue Analysis</option>
              <option value="efficiency-report">Efficiency Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all-areas">All Areas</option>
              <option value="downtown">Downtown</option>
              <option value="residential-north">Residential North</option>
              <option value="industrial">Industrial Zone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Date Range
            </label>
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Waste Types
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(selectedWasteTypes).map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedWasteTypes[type]}
                  onChange={() => handleWasteTypeChange(type)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: "#4CBB17" }}
                />
                <span className="text-sm text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="w-full text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:opacity-90"
          style={{ backgroundColor: "#4CBB17" }}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm">Generate Report</span>
        </button>
      </div>

      <StatsGrid statistics={statistics} />
      <RecentRequestsTable navigate={navigate} />

      {/* Generated Reports Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Generated Reports
          </h2>
        </div>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">No reports generated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Report Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Area
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Recycling Rate
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Generated At
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {r.reportType}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {r.area}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "#4CBB1720",
                          color: "#4CBB17",
                        }}
                      >
                        {r.recyclingRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewPdf(r.id)}
                        className="px-3 py-1 text-white rounded text-xs font-medium mr-2"
                        style={{ backgroundColor: "#4CBB17" }}
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportGenerationView;
