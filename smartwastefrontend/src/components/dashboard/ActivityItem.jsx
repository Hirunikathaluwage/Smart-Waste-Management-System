/**
 * ActivityItem - Reusable activity/list item component
 * Follows Single Responsibility Principle
 */
const ActivityItem = ({ title, subtitle, status, statusColors }) => {
  const defaultStatusColors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200'
  };

  const colors = statusColors || defaultStatusColors;

  return (
    <div className="flex items-center justify-between py-4 px-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex-1">
        <p className="text-gray-900 font-semibold text-sm">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status]} ml-4`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    </div>
  );
};

export default ActivityItem;

