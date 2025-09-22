import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Chat from './Chat.jsx';
import Workspace from './Workspace.jsx';
import MobileCamera from './MobileCamera.jsx';
import { Sun, Moon } from 'lucide-react'; // Using lucide-react for icons

function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname.startsWith('/workspace') ? 'workspace' : 'chat');
  }, [location]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Don't render the main app layout for the mobile camera view
  if (location.pathname === '/mobile-camera') {
    return <MobileCamera />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl" role="img" aria-label="logo">🛍️</span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  List'n'<span className="text-pink-600 dark:text-pink-400">EZ</span>
                </h1>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                AI Assistant
              </Link>
              <Link
                to="/workspace"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'workspace'
                    ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tools Workspace
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <button className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/workspace/*" element={<Workspace />} />
          <Route path="/mobile-camera" element={<MobileCamera />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;