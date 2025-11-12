import { motion } from 'framer-motion';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: any) => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const navItems = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Done' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Daily Planner
          </h1>
        </div>

        <nav className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2" role="tablist">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                ${
                  currentView === item.id
                    ? 'text-primary dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              role="tab"
              aria-selected={currentView === item.id}
            >
              {item.label}
              {currentView === item.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
