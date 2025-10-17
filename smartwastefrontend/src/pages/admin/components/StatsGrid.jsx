const StatsGrid = ({ statistics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    {statistics.map((stat) => {
      const Icon = stat.icon;
      return (
        <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
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
              <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatsGrid;
