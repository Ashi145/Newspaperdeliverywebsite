import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Newspaper, User, MapPin, Phone, LogOut, Edit, Package, Check, Bell } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page } from '../App';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  setCurrentPage: (page: Page) => void;
  accessToken: string;
}

const newspapers = [
  { id: 'new-vision', name: 'New Vision', logo: '📰' },
  { id: 'bukedde', name: 'Bukedde', logo: '📄' },
  { id: 'daily-monitor', name: 'Daily Monitor', logo: '📋' },
  { id: 'daily-nation', name: 'Daily Nation', logo: '📃' }
];

const plans = [
  {
    id: 'daily',
    name: 'Daily',
    price: '$1.2',
    ugx: 'UGX 3,500',
    description: 'Choose one newspaper daily'
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$34',
    ugx: 'UGX 125,000',
    description: 'All newspapers for 30 days'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$142',
    ugx: 'UGX 505,000',
    description: 'All newspapers + weekend editions'
  }
];

export function Dashboard({ user, onSignOut, setCurrentPage, accessToken }: DashboardProps) {
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedNewspaper, setSelectedNewspaper] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomerData = async () => {
    try {
      const [infoResponse, subResponse] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9cb37aa1/customer-info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9cb37aa1/subscription`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      ]);

      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setCustomerInfo(infoData);
      }

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    if (selectedPlan === 'daily' && !selectedNewspaper) return;

    setSubscribing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9cb37aa1/subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            plan: selectedPlan,
            newspaper: selectedNewspaper || null
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        setSelectedPlan('');
        setSelectedNewspaper('');
      }
    } catch (err) {
      console.error('Error subscribing:', err);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Newspaper className="size-8" />
            <span className="text-2xl">Daily Paper</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">
              {user?.user_metadata?.name || user?.email}
            </span>
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-blue-900 transition-all"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-12 text-gray-800"
        >
          My Dashboard
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl text-gray-800">Delivery Information</h2>
              <button
                onClick={() => setCurrentPage('customer-info')}
                className="flex items-center gap-2 text-blue-900 hover:text-blue-700"
              >
                <Edit className="size-4" />
                Edit
              </button>
            </div>

            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : customerInfo ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="size-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="text-gray-800">{customerInfo.fullName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Telephone</div>
                    <div className="text-gray-800">{customerInfo.telephone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="text-gray-800">{customerInfo.address}</div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-sm text-gray-500">Plot Number</div>
                    <div className="text-gray-800">{customerInfo.plotNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Street Number</div>
                    <div className="text-gray-800">{customerInfo.streetNumber}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">No delivery information yet</p>
                <button
                  onClick={() => setCurrentPage('customer-info')}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all"
                >
                  Add Information
                </button>
              </div>
            )}
          </motion.div>

          {/* Current Subscription Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-start gap-3 mb-6">
              <Package className="size-6 text-blue-900" />
              <h2 className="text-2xl text-gray-800">Current Subscription</h2>
            </div>

            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-6 rounded-lg">
                  <div className="text-3xl mb-2">{subscription.planName}</div>
                  <div className="text-blue-100">{subscription.planPrice}</div>
                  {subscription.newspaper && (
                    <div className="mt-4 text-sm">
                      Selected Paper: {subscription.newspaper}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="size-5" />
                  <span>Active Subscription</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No active subscription</div>
            )}
          </motion.div>
        </div>

        {/* News Updates Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border-2 border-orange-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Bell className="size-12 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl mb-2 text-gray-800">Live News Updates</h3>
                <p className="text-gray-600">
                  Stay informed with real-time news from New Vision, Daily Monitor, Daily Nation, and social media. 
                  Read on your phone or desktop with auto-refresh every minute!
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('updates')}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all whitespace-nowrap shadow-lg"
            >
              View News Updates
            </motion.button>
          </div>
        </motion.div>

        {/* Subscribe Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl mb-6 text-gray-800">
            {subscription ? 'Change Subscription' : 'Subscribe Now'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="text-xl mb-2">{plan.name}</h3>
                <div className="text-2xl text-blue-900 mb-1">{plan.price}</div>
                <div className="text-sm text-gray-600 mb-3">{plan.ugx}</div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </motion.div>
            ))}
          </div>

          {selectedPlan === 'daily' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <label className="block text-gray-700 mb-3">Select Your Newspaper</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newspapers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedNewspaper(paper.name)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all text-center ${
                      selectedNewspaper === paper.name
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{paper.logo}</div>
                    <div className="text-sm">{paper.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubscribe}
            disabled={!selectedPlan || (selectedPlan === 'daily' && !selectedNewspaper) || subscribing}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscribing ? 'Subscribing...' : subscription ? 'Update Subscription' : 'Subscribe Now'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}