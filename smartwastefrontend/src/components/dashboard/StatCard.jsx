/**
 * StatCard - Reusable statistics card component
 * Follows Single Responsibility Principle
 */
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-2">
      <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

export default StatCard;

