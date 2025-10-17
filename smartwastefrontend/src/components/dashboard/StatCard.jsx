/**
 * StatCard Component
 *
 * SOLID Principles:
 * - Single Responsibility: Only displays a single statistic card
 * - Open/Closed: Can be extended with new styles without modifying existing code
 * - Dependency Inversion: Depends on props abstraction, not concrete data
 *
 * Props:
 * @param {Object} stat - Statistics data object
 */

const StatCard = ({ stat }) => {
  const IconComponent = stat.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${stat.iconColor}15` }}
        >
          <IconComponent className="w-5 h-5" style={{ color: stat.iconColor }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;