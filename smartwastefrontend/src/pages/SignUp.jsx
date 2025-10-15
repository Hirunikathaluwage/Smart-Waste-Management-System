import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { Input, Button, UserTypeSelector, AuthLayout } from '../components/auth/AuthComponents';
import { signUp } from '../services/authService';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'resident'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1).toLowerCase()
      };

      const response = await signUp(payload);
      console.log('Signup success:', response.data);

      alert('Account created successfully!');
      navigate('/signin');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join EcoCollect and help make a difference"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
          <Input
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <UserTypeSelector
          selectedType={formData.userType}
          onTypeChange={(type) => setFormData(prev => ({ ...prev, userType: type }))}
        />

        <Button type="submit" className="w-full">
          Sign up
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <Link to="/signin">
          <Button variant="outline" className="w-full">
            Sign in
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default SignUp;