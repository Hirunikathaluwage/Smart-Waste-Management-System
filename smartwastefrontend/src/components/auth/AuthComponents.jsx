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
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#4CBB17' }}
      onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(76, 187, 23, 0.5)'}
      onBlur={(e) => e.target.style.boxShadow = ''}
    />
  </div>
);

export const Button = ({ type = 'button', onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const getVariantStyles = (variant) => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: '#4CBB17',
          color: 'white',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: '#e5e7eb',
          color: '#111827',
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#4CBB17',
          border: '2px solid #4CBB17'
        };
      default:
        return {};
    }
  };

  const getHoverColor = (variant) => {
    switch(variant) {
      case 'primary':
        return '#3da612';
      case 'secondary':
        return '#d1d5db';
      case 'outline':
        return '#4CBB1710';
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
      style={getVariantStyles(variant)}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = getHoverColor(variant);
          } else {
            e.currentTarget.style.backgroundColor = getHoverColor(variant);
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variant === 'outline' ? 'transparent' : getVariantStyles(variant).backgroundColor;
        }
      }}
    >
      {children}
    </button>
  );
};

export const UserTypeSelector = ({ selectedType, onTypeChange }) => {
  const userTypes = ['resident', 'worker', 'admin', 'business'];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userTypes.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className="py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
            style={
              selectedType === type
                ? { backgroundColor: '#4CBB17', color: 'white' }
                : { backgroundColor: '#f3f4f6', color: '#111827' }
            }
            onMouseEnter={(e) => {
              if (selectedType !== type) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedType !== type) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
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