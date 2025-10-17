const RecentRequestsTable = ({ navigate }) => {
  const recentRequests = [
    { id: 'SP-001', resident: 'John Smith', area: 'Downtown', date: '2024-01-15', status: 'pending', statusColor: '#fbbf24' },
    { id: 'SP-002', resident: 'Sarah Johnson', area: 'Residential North', date: '2024-01-16', status: 'approved', statusColor: '#4CBB17' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
        <button
          onClick={() => navigate('/admin/bins')}
          className="text-sm font-medium transition-colors"
          style={{ color: '#4CBB17' }}
        >
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resident</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Area</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((req) => (
              <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">#{req.id}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{req.resident}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{req.area}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{req.date}</td>
                <td className="py-3 px-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${req.statusColor}20`,
                      color: req.statusColor
                    }}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 text-white rounded text-xs font-medium mr-2" style={{ backgroundColor: '#4CBB17' }}>
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRequestsTable;
