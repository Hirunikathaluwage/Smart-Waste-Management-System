import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Input, Button, UserTypeSelector, AuthLayout } from '../components/auth/AuthComponents';
import { signIn } from '../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        email: formData.email,
        password: formData.password,
      };

      const response = await signIn(payload);
      console.log('Login success:', response.data);

      alert(`Welcome, ${response.data.name}!`);

      // Navigate based on role
      if (response.data.role === 'Collector') {
        navigate('/collector/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back to EcoCollect"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <UserTypeSelector
          selectedType={formData.userType}
          onTypeChange={(type) => setFormData(prev => ({ ...prev, userType: type }))}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>

        <Link to="/signup">
          <Button variant="outline" className="w-full">
            Sign up
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default SignIn;