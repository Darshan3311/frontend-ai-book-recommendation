import React from 'react';

const BookCardSkeleton: React.FC = () => {
  return (
    <div className="book-card animate-pulse">
      {/* Cover Skeleton with shimmer */}
      <div className="aspect-[3/4] mb-4 bg-gray-300 dark:bg-gray-600 rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        {/* Loading icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
        
        {/* Author */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        
        {/* Genre Badge */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3"></div>
        
        {/* Summary */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
        </div>
        
        {/* Metadata */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

const BookSkeletonGrid: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 15 }, (_, index) => (
          <div
            key={index}
            style={{
              animationDelay: `${(index * 0.1)}s`
            }}
            className="animate-fade-in"
          >
            <BookCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSkeletonGrid;