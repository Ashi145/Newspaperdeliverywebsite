import { motion } from 'motion/react';
import { Newspaper, Check, Truck, Clock } from 'lucide-react';
import type { Page } from '../App';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
}

const newspapers = [
  { name: 'New Vision', logo: '📰' },
  { name: 'Bukedde', logo: '📄' },
  { name: 'Daily Monitor', logo: '📋' },
  { name: 'Daily Nation', logo: '📃' }
];

const plans = [
  {
    name: 'Daily',
    price: '$1.2',
    ugx: 'UGX 3,500',
    features: ['Choose one newspaper', 'Daily delivery', 'Cancel anytime'],
    popular: false
  },
  {
    name: 'Monthly',
    price: '$34',
    ugx: 'UGX 125,000',
    features: ['All newspapers', 'Daily delivery', '30-day access', 'Priority support'],
    popular: true
  },
  {
    name: 'Premium',
    price: '$142',
    ugx: 'UGX 505,000',
    features: ['All newspapers', 'Daily delivery', 'Weekend editions', 'VIP support', 'Digital access'],
    popular: false
  }
];

export function Home({ setCurrentPage }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <Newspaper className="size-8" />
            <span className="text-2xl">Daily Paper</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-4"
          >
            <button
              onClick={() => setCurrentPage('signin')}
              className="px-6 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-6 py-2 rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-all duration-300"
            >
              Sign Up
            </button>
          </motion.div>
        </nav>

        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl mb-6">Your Daily News, Delivered Fresh</h1>
            <p className="text-xl mb-8 text-blue-100">
              Get Uganda's top newspapers delivered to your doorstep every morning. Choose from New Vision, Bukedde, Daily Monitor, and Daily Nation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('signup')}
              className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg"
            >
              Start Your Subscription
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:block"
          >
            <img
              src="https://images.unsplash.com/photo-1765054776840-718e3652ec15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBkZWxpdmVyeSUyMG1vcm5pbmd8ZW58MXx8fHwxNzY1NTI1MTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Newspaper delivery"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl text-center mb-12 text-gray-800"
        >
          Why Choose Daily Paper?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: 'Reliable Delivery', desc: 'Fresh newspapers at your doorstep every morning' },
            { icon: Clock, title: 'On Time', desc: 'Delivered before 7 AM, guaranteed' },
            { icon: Check, title: 'Flexible Plans', desc: 'Choose the plan that fits your needs' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <feature.icon className="size-12 text-blue-900 mb-4" />
              <h3 className="text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* News Updates Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl mb-3">📱 Read News on Your Phone</h3>
              <p className="text-lg text-orange-50">
                Access live news updates from all major newspapers and social media in real-time. 
                Auto-refreshes every minute to keep you informed!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('signup')}
              className="px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all shadow-lg whitespace-nowrap"
            >
              Try News Updates
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Newspapers Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl text-center mb-12 text-gray-800"
          >
            Available Newspapers
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newspapers.map((paper, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl text-center shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3">{paper.logo}</div>
                <h3 className="text-lg">{paper.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl text-center mb-12 text-gray-800"
        >
          Choose Your Plan
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
              className={`relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-4 ring-orange-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl mb-2 text-center">{plan.name}</h3>
              <div className="text-center mb-6">
                <div className="text-4xl text-blue-900 mb-1">{plan.price}</div>
                <div className="text-gray-600">{plan.ugx}</div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('signup')}
                className={`w-full py-3 rounded-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                Subscribe Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="size-6" />
            <span className="text-xl">Daily Paper</span>
          </div>
          <p className="text-gray-400">Your trusted newspaper delivery service in Uganda</p>
        </div>
      </footer>
    </div>
  );
}