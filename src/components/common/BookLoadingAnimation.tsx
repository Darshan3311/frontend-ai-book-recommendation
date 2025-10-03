import React from 'react';

const BookLoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      {/* Main Book Animation */}
      <div className="relative">
        {/* Book Base */}
        <div className="book-container">
          <div className="book">
            {/* Book Cover */}
            <div className="book-cover">
              <div className="book-spine"></div>
              <div className="book-front">
                <div className="book-title">
                  <div className="title-line"></div>
                  <div className="title-line short"></div>
                  <div className="title-line"></div>
                </div>
              </div>
            </div>
            
            {/* Animated Pages */}
            <div className="pages">
              <div className="page page-1"></div>
              <div className="page page-2"></div>
              <div className="page page-3"></div>
              <div className="page page-4"></div>
              <div className="page page-5"></div>
            </div>
          </div>
        </div>
        
        {/* Floating Books Animation */}
        <div className="floating-books">
          <div className="floating-book floating-book-1">📚</div>
          <div className="floating-book floating-book-2">📖</div>
          <div className="floating-book floating-book-3">📘</div>
          <div className="floating-book floating-book-4">📗</div>
          <div className="floating-book floating-book-5">📙</div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
          Discovering Amazing Books
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="loading-dots">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Our AI is carefully curating the perfect book recommendations just for you...
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className="progress-bar h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default BookLoadingAnimation;