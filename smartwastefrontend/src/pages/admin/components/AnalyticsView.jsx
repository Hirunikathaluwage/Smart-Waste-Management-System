import { ArrowRight, TrendingUp, Recycle, DollarSign, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnalyticsView = () => {
  const navigate = useNavigate();

  const analyticsDashboards = [
    {
      id: 'performance',
      title: 'Waste Collection Performance',
      description: 'Monitor collection efficiency, worker performance, and route optimization',
      icon: TrendingUp,
      color: '#4CBB17',
      path: '/admin/performance'
    },
    {
      id: 'recycling',
      title: 'Recycling Trends',
      description: 'Track recycling rates, waste composition, and sustainability metrics',
      icon: Recycle,
      color: '#3b82f6',
      path: '/admin/recycling'
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'View billing data, payment trends, and revenue analytics',
      icon: DollarSign,
      color: '#f59e0b',
      path: '/admin/financial'
    },
    {
      id: 'environmental',
      title: 'Environmental Impact',
      description: 'Analyze carbon footprint, waste reduction, and environmental KPIs',
      icon: Leaf,
      color: '#10b981',
      path: '/admin/environmental'
    }
  ];

  return (
    <>
      {/* Dashboard Cards */}
      <div className="mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboards</h2>
          <p className="text-gray-600 mt-1">
            Select a dashboard to view detailed analytics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyticsDashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <div
                key={dashboard.id}
                onClick={() => navigate(dashboard.path)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-transparent group"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = dashboard.color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${dashboard.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: dashboard.color }} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {dashboard.title}
                </h3>
                <p className="text-sm text-gray-600">{dashboard.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AnalyticsView;
