import React, { useState, useEffect } from 'react';
import { Search, Heart, Trash2, Calendar, Star, BookOpen } from 'lucide-react';
import { useSavedBooks } from '../../context/SavedBooksContext';
import BookCoverImage from '../common/BookCoverImage';

const SavedBooks: React.FC = () => {
  const { savedBooks, removeSavedBook, isLoading, fetchSavedBooks } = useSavedBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'author'>('newest');

  useEffect(() => {
    fetchSavedBooks();
  }, [fetchSavedBooks]);

  // Filter books based on search term
  const filteredBooks = savedBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort books based on selected option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
      case 'oldest':
        return new Date(a.saved_at).getTime() - new Date(b.saved_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  const handleRemoveBook = async (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to remove "${bookTitle}" from your saved books?`)) {
      await removeSavedBook(bookId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Saved Books
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {savedBooks.length === 0 
            ? "You haven't saved any books yet. Start exploring to build your collection!"
            : `${savedBooks.length} book${savedBooks.length === 1 ? '' : 's'} in your collection`
          }
        </p>
      </div>

      {savedBooks.length > 0 && (
        <>
          {/* Search and Filter Controls */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your saved books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="input-field"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {sortedBooks.length} of {savedBooks.length} saved books
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            )}
          </div>

          {/* Books Grid */}
          {sortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {sortedBooks.map((book) => (
                <div key={book.id} className="book-card group">
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-t-xl bg-gray-200 dark:bg-gray-700">
                    <BookCoverImage
                      src={book.cover_image_url || ''}
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Rating Badge */}
                    {book.rating && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1 z-10">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveBook(book.id, book.title)}
                      className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 z-10"
                      title="Remove from saved books"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Saved Badge */}
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1 z-10">
                      <Heart className="h-3 w-3 fill-current" />
                      <span>Saved</span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    {/* Title and Author */}
                    <div className="space-y-1">
                      <h3 className="font-serif font-semibold text-base lg:text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium text-sm truncate">
                        by {book.author}
                      </p>
                    </div>

                    {/* Genre Badge */}
                    <div className="flex items-center justify-between">
                      <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-xs font-medium">
                        {book.genre}
                      </span>
                    </div>

                    {/* Summary */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {book.summary}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {book.publication_year && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{book.publication_year}</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p>Saved {new Date(book.saved_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No saved books match your search criteria. Try adjusting your search terms.
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {savedBooks.length === 0 && (
        <div className="text-center py-16">
          <Heart className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
            No saved books yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Start exploring book recommendations and save your favorites to build your personal library. 
            Click the heart icon on any book to add it to your collection!
          </p>
          <div className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <Search className="h-5 w-5" />
            <span className="font-medium">Start discovering books</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedBooks;