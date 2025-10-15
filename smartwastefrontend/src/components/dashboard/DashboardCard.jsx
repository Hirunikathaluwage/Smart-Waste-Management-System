/**
 * DashboardCard - Reusable card component
 * Follows Single Responsibility Principle - only displays a card
 * Follows Open/Closed Principle - can be extended via props
 */
const DashboardCard = ({ title, description, icon, color, onClick, value, trend }) => (
  <div 
    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    {value && (
      <div className="text-2xl font-bold text-gray-900">
        {value}
      </div>
    )}
  </div>
);

export default DashboardCard;

