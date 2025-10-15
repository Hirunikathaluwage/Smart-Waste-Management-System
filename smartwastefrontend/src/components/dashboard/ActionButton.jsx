/**
 * ActionButton - Reusable action button component
 * Follows Single Responsibility Principle
 * Follows Open/Closed Principle - customizable via props
 */
const ActionButton = ({ label, icon, onClick, colorScheme = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
    indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 hover:border-indigo-300',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 hover:border-purple-300'
  };

  return (
    <button 
      className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 font-medium border-2 ${colorClasses[colorScheme]} hover:shadow-md transform hover:-translate-y-0.5`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export default ActionButton;

