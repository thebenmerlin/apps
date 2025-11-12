import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodayView from './pages/TodayView';
import WeekView from './pages/WeekView';
import Settings from './pages/Settings';
import Header from './components/Header';
import BannerAdPlaceholder from './components/BannerAdPlaceholder';
import { useTasks } from './hooks/useTasks';
import { useNotifications } from './hooks/useNotifications';

type View = 'today' | 'week' | 'all' | 'completed' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('today');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [showAds, setShowAds] = useState(() => {
    const saved = localStorage.getItem('showAds');
    return saved !== 'false';
  });

  const { tasks, loading } = useTasks();
  const { initializeNotifications } = useNotifications();

  useEffect(() => {
    // Initialize notifications on app load
    initializeNotifications();
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('showAds', showAds.toString());
  }, [showAds]);

  const renderView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView />;
      case 'week':
        return <WeekView />;
      case 'all':
        return <TodayView showAll />;
      case 'completed':
        return <TodayView showCompleted />;
      case 'settings':
        return (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showAds={showAds}
            setShowAds={setShowAds}
          />
        );
      default:
        return <TodayView />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showAds && <BannerAdPlaceholder />}
    </div>
  );
}

export default App;
