import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/ResidentDashboardLayout';
import PickupRequestForm from '../../components/pickup/PickupRequestForm';
import PickupRequestList from '../../components/pickup/PickupRequestList';
import { Calendar, Trash2, CreditCard, Award, MessageCircle } from 'lucide-react';

const PickupRequestPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Define navigation items for resident
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'requests', label: 'My Requests', icon: Trash2 },
    { id: 'schedule', label: 'Collection Schedule', icon: Calendar },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'rewards', label: 'Eco Rewards', icon: Award },
    { id: 'support', label: 'Support', icon: MessageCircle },
  ];

  const handleRequestSuccess = (result) => {
    setSuccessData(result);
    setShowSuccessMessage(true);
    setActiveTab('list');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleCancelForm = () => {
    setActiveTab('list');
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (navId) => {
    if (navId === 'overview') {
      navigate('/resident/dashboard');
    } else if (navId === 'requests') {
      // Stay on current page but switch to requests tab
      setActiveTab('list');
    } else {
      // For other nav items, navigate to dashboard with appropriate tab
      navigate('/resident/dashboard');
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeNav="requests"
      onNavClick={handleNavClick}
      logo="Resident"
      user={user}
      onLogout={handleLogout}
      pageTitle="Waste Pickup Requests"
      pageSubtitle="Request waste pickup services for your home or business"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Waste Pickup Requests</h1>
        <p className="mt-2 text-gray-600">
          Request waste pickup services for your home or business
        </p>
      </div>

        {/* Success Message */}
        {showSuccessMessage && successData && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Pickup Request Submitted Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Request ID: {successData.requestId}</p>
                  <p>Total Amount: ${successData.finalAmount?.toFixed(2)}</p>
                  <p>Status: {successData.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('new')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'new'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                New Request
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'new' && (
            <PickupRequestForm
              onSuccess={handleRequestSuccess}
              onCancel={handleCancelForm}
            />
          )}
          
          {activeTab === 'list' && (
            <PickupRequestList userId={user?.userId} />
          )}
        </div>

        {/* Information Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quick Pickup</h3>
                <p className="text-sm text-gray-500">
                  Schedule regular pickups or request extra collections as needed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Flexible Payment</h3>
                <p className="text-sm text-gray-500">
                  Pay now with card or cash, or pay later. Use reward points to save money
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Real-time Tracking</h3>
                <p className="text-sm text-gray-500">
                  Track your request status and get notifications about pickup updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Base Fees</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bulky Waste: $25.00 base fee</li>
                <li>• E-Waste: $15.00 base fee</li>
                <li>• General Waste: $10.00 base fee</li>
                <li>• Additional $2.00 per kg for weight-based pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Urgency Fees</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Emergency Pickup: +50% of base fee</li>
                <li>• Extra Pickup: +20% of base fee</li>
                <li>• Regular Pickup: No additional fee</li>
                <li>• Reward Points: 1 point = $0.01</li>
              </ul>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default PickupRequestPage;
