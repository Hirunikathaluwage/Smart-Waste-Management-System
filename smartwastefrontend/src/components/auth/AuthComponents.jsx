import { Link } from 'react-router-dom';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

export const Button = ({ type = 'button', onClick, children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const UserTypeSelector = ({ selectedType, onTypeChange }) => {
  const userTypes = ['resident', 'collector', 'dispatcher', 'admin'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        I am a
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userTypes.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`py-2 px-4 rounded-lg text-sm font-medium ${
              selectedType === type
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col pt-16 sm:pt-20 pb-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-2xl lg:max-w-4xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl lg:max-w-4xl">
      <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-12 lg:px-16">
        {children}
      </div>
    </div>
  </div>
);
