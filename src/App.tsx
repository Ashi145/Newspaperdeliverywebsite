import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from './components/Home';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { CustomerInfo } from './components/CustomerInfo';
import { Dashboard } from './components/Dashboard';
import { NewsUpdates } from './components/NewsUpdates';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type Page = 'home' | 'signin' | 'signup' | 'customer-info' | 'dashboard' | 'updates';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        setCurrentPage('dashboard');
      }
    };
    checkSession();
  }, []);

  const handleSignIn = async (user: any, token: string) => {
    setUser(user);
    setAccessToken(token);
    setCurrentPage('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken('');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Home setCurrentPage={setCurrentPage} />
          </motion.div>
        )}
        {currentPage === 'signin' && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <SignIn setCurrentPage={setCurrentPage} onSignIn={handleSignIn} />
          </motion.div>
        )}
        {currentPage === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <SignUp setCurrentPage={setCurrentPage} onSignUp={handleSignIn} />
          </motion.div>
        )}
        {currentPage === 'customer-info' && (
          <motion.div
            key="customer-info"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <CustomerInfo setCurrentPage={setCurrentPage} accessToken={accessToken} />
          </motion.div>
        )}
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard user={user} onSignOut={handleSignOut} setCurrentPage={setCurrentPage} accessToken={accessToken} />
          </motion.div>
        )}
        {currentPage === 'updates' && (
          <motion.div
            key="updates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <NewsUpdates setCurrentPage={setCurrentPage} accessToken={accessToken} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;