import React, { useState, useEffect } from 'react';

interface BookCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const BookCoverImage: React.FC<BookCoverImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRBNTU2OCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gQ292ZXI8L3RleHQ+Cjwvc3ZnPg==' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptCount, setAttemptCount] = useState(0);

  // Reset state when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setAttemptCount(0);
  }, [src]);

  const handleLoad = () => {
    console.log(`Image loaded successfully: ${currentSrc} for ${alt}`);
    setIsLoading(false);
    setHasError(false);
    setAttemptCount(0); // Reset for next time
    // Dispatch custom event for progress tracking
    window.dispatchEvent(new CustomEvent('bookImageLoaded'));
  };

  const handleError = () => {
    console.log(`Image failed to load: ${currentSrc} (attempt ${attemptCount + 1})`);
    
    if (attemptCount === 0 && currentSrc !== fallbackSrc) {
      // First fallback - try the provided fallback URL
      setCurrentSrc(fallbackSrc);
      setAttemptCount(1);
      setHasError(false);
    } else if (attemptCount === 1) {
      // Second fallback - try a different placeholder service
      const altFallback = 'https://dummyimage.com/300x400/4A5568/ffffff.png&text=Book+Cover';
      setCurrentSrc(altFallback);
      setAttemptCount(2);
      setHasError(false);
    } else {
      // All fallbacks failed, show error state
      setIsLoading(false);
      setHasError(true);
      console.error(`All image sources failed for: ${alt}`);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-xl">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"></div>
          {/* Loading overlay with book icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 rounded-t-xl">
            <div className="text-center">
              <div className="animate-bounce mb-2">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Loading...</div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">No Cover</div>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />

      {/* Progressive Loading Indicator */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 rounded-b-xl overflow-hidden">
          <div className="h-full bg-primary-500 animate-progress-bar rounded-b-xl"></div>
        </div>
      )}
    </div>
  );
};

export default BookCoverImage;