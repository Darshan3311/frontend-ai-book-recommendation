import React from 'react';
import { Book } from '../../services/books';
import { X, BookOpen, Calendar, Star, Languages, Users, FileText, BookMarked, GraduationCap } from 'lucide-react';

interface BookDetailsModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (book: Book) => void;
  isSaved?: boolean;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, isOpen, onClose, onSave, isSaved }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(book);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header Section with Cover and Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-full md:w-64 h-96 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={book.cover_image_url}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#4A5568"/>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#FFFFFF" text-anchor="middle" dy=".3em">No Cover</text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                by {book.author}
              </p>

              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/ 5.0</span>
                </div>
              )}

              {/* Genre Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold">
                  {book.genre}
                </span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {book.year_published && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{book.year_published}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{book.pages} pages</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm">{book.language}</span>
                  </div>
                )}
                {book.target_audience && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm capitalize">{book.target_audience.replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {onSave && (
                <button
                  onClick={handleSaveClick}
                  disabled={isSaved}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                    isSaved
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
                  }`}
                >
                  {isSaved ? '✓ Saved to Library' : 'Save to Library'}
                </button>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookMarked className="w-6 h-6" />
              Book Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ISBN */}
              {book.isbn && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    ISBN
                  </h3>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {book.isbn}
                  </p>
                </div>
              )}

              {/* Publisher */}
              {book.publisher && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Publisher
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {book.publisher}
                  </p>
                </div>
              )}

              {/* Book Type */}
              {book.book_type && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Book Type
                  </h3>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {book.book_type.replace('_', ' ')}
                  </p>
                </div>
              )}

              {/* Content Type */}
              {book.content_type && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Content Type
                  </h3>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {book.content_type.replace('_', ' ')}
                  </p>
                </div>
              )}

              {/* Reading Level */}
              {book.reading_level && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Reading Level
                  </h3>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {book.reading_level}
                  </p>
                </div>
              )}

              {/* Target Audience */}
              {book.target_audience && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Target Audience
                  </h3>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {book.target_audience.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
