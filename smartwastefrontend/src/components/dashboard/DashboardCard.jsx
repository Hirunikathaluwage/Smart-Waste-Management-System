/**
 * DashboardCard Component
 *
 * SOLID Principles:
 * - Single Responsibility: Displays a clickable dashboard card
 * - Interface Segregation: Only receives props it needs
 *
 * Avoiding Code Smells:
 * - Long Method: Extracted hover handlers to inline functions
 * - Feature Envy: Component manages its own hover state
 *
 * Props:
 * @param {Object} dashboard - Dashboard configuration object
 * @param {Function} onNavigate - Navigation handler function
 */

import { ArrowRight } from "lucide-react";

const DashboardCard = ({ dashboard, onNavigate }) => {
  // Handle both React components and string icons (emojis)
  const renderIcon = () => {
    if (typeof dashboard.icon === 'string') {
      // If it's a string (emoji), render it directly
      return (
        <span className="text-2xl">
          {dashboard.icon}
        </span>
      );
    } else {
      // If it's a React component, render it
      const IconComponent = dashboard.icon;
      return (
        <IconComponent
          className="w-6 h-6"
          style={{ color: dashboard.color }}
        />
      );
    }
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = dashboard.color;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = "transparent";
  };

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(dashboard.path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-transparent group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${dashboard.color}15` }}
        >
          {renderIcon()}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all group-hover:translate-x-1" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-opacity-80">
        {dashboard.title}
      </h3>
      <p className="text-sm text-gray-600">{dashboard.description}</p>
    </div>
  );
};

export default DashboardCard;
