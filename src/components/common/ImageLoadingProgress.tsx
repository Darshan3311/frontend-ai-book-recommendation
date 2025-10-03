import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface ImageLoadingProgressProps {
  totalImages: number;
  loadedImages: number;
  className?: string;
}

const ImageLoadingProgress: React.FC<ImageLoadingProgressProps> = ({ 
  totalImages, 
  loadedImages,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (loadedImages >= totalImages) {
      // Hide progress after all images are loaded
      setTimeout(() => setIsVisible(false), 1000);
    }
  }, [loadedImages, totalImages]);

  // Reset visibility when totalImages changes (new search)
  useEffect(() => {
    setIsVisible(true);
  }, [totalImages]);

  if (!isVisible || totalImages === 0) return null;

  const progress = (loadedImages / totalImages) * 100;
  const isComplete = loadedImages >= totalImages;

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Image className={`h-4 w-4 text-primary-500 ${!isComplete ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isComplete ? 'Images loaded!' : 'Loading images...'}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{loadedImages} of {totalImages}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLoadingProgress;