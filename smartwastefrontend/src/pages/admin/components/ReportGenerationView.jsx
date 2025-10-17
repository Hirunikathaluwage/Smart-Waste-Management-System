import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Recycle,
  MapPin,
  AlertCircle,
} from "lucide-react";
import StatsGrid from "./StatsGrid";
import RecentRequestsTable from "./RecentRequestsTable";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // for backend calls

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

  const handleWasteTypeChange = (type) =>
    setSelectedWasteTypes((prev) => ({ ...prev, [type]: !prev[type] }));

  // Backend integration (with working alert + error handling)
  const handleGenerateReport = async () => {
    const payload = { reportType, area, dateRange, selectedWasteTypes };
    console.log("📤 Sending report payload:", payload);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/reports/generate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" Backend response:", res.data);

      alert(
        `Report Generated Successfully!\n\nType: ${
          res.data.reportType
        }cycling Rate: ${res.data.recyclingRate.toFixed(2)}%`
      );
    } catch (error) {
      console.error("Error generating report:", error);
      if (error.response) {
        alert(
          `Backend Error (${error.response.status}): ${
            error.response.data?.message || "Unknown error"
          }`
        );
      } else {
        alert(
          "Failed to connect to backend. Is Spring Boot running on port 8080?"
        );
      }
    }
  };

  return (
    <>
      {/* Report Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#4CBB17" }}
            >
              <option value="waste-trends">Waste Trends</option>
              <option value="collection-routes">Collection Routes</option>
              <option value="revenue-analysis">Revenue Analysis</option>
              <option value="efficiency-report">Efficiency Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#4CBB17" }}
            >
              <option value="all-areas">All Areas</option>
              <option value="downtown">Downtown</option>
              <option value="residential-north">Residential North</option>
              <option value="industrial">Industrial Zone</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "#4CBB17" }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waste Types
          </label>
          <div className="flex flex-wrap gap-4">
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
          className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          style={{ backgroundColor: "#4CBB17" }}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Generate Report</span>
        </button>
      </div>

      <StatsGrid statistics={statistics} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Waste Trends
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Chart visualization will be displayed here
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recycling Rates by Area
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Chart visualization will be displayed here
            </p>
          </div>
        </div>
      </div>

      <RecentRequestsTable navigate={navigate} />
    </>
  );
};

export default ReportGenerationView;
