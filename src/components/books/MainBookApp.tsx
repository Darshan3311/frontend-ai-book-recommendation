import React, { useState } from 'react';
import { Search, Heart, BookOpen, User, LogOut } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import BookRecommendations from './BookRecommendations';
import SavedBooks from './SavedBooks';
import toast from 'react-hot-toast';

type TabType = 'discover' | 'saved';

const MainBookApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const tabs = [
    {
      id: 'discover' as TabType,
      label: 'Discover Books',
      icon: Search,
      description: 'Find new book recommendations'
    },
    {
      id: 'saved' as TabType,
      label: 'Saved Books',
      icon: Heart,
      description: 'Your personal book collection'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
              <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-300" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BookFinder</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.username}!</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  title={tab.description}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-500' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main>
        {activeTab === 'discover' && <BookRecommendationsContent />}
        {activeTab === 'saved' && <SavedBooks />}
      </main>
    </div>
  );
};

// Extracted content component for BookRecommendations without header
const BookRecommendationsContent: React.FC = () => {
  return <BookRecommendations hideHeader />;
};

export default MainBookApp;