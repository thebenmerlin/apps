import { useState } from 'react';
import { storage } from '../utils/storage';

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  showAds: boolean;
  setShowAds: (value: boolean) => void;
}

export default function Settings({ darkMode, setDarkMode, showAds, setShowAds }: SettingsProps) {
  const [exportStatus, setExportStatus] = useState('');

  const handleExport = async () => {
    try {
      const data = await storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('Export successful!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('Export failed');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await storage.importData(text);
      setExportStatus('Import successful!');
      setTimeout(() => {
        setExportStatus('');
        window.location.reload();
      }, 2000);
    } catch (error) {
      setExportStatus('Import failed - invalid file');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

      <div className="space-y-4">
        {/* Dark Mode */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Show Ads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Show Ads</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle ad placeholders</p>
          </div>
          <button
            onClick={() => setShowAds(!showAds)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showAds ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label="Toggle ads"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showAds ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Backup & Restore</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Export Data
            </button>
            <label className="block">
              <span className="sr-only">Import data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
            </label>
            {exportStatus && (
              <p className="text-sm text-center text-primary">{exportStatus}</p>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Daily Planner v1.0.0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            A mobile-first task planner with offline support
          </p>
        </div>
      </div>
    </div>
  );
}
