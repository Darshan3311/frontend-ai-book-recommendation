import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, User, LogOut, Loader2, Star, Calendar, X, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSavedBooks } from '../../context/SavedBooksContext';
import { booksApi, BookQuery, Book, FilterOptions } from '../../services/books';
import BookLoadingAnimation from '../common/BookLoadingAnimation';
import BookSkeletonGrid from '../common/BookSkeletonGrid';
import BookCoverImage from '../common/BookCoverImage';

interface BookRecommendationsProps {
  hideHeader?: boolean;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({ hideHeader = false }) => {
  const { user, logout } = useAuth();
  const { savedBooks, saveBook, removeSavedBook, isBookSaved, getSavedBookId, fetchSavedBooks } = useSavedBooks();
  const [searchForm, setSearchForm] = useState<BookQuery>({
    query: '',
    range: '10-20',
    get_all_available: false,
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [showImageProgress, setShowImageProgress] = useState(false);

  // Filter books based on current filters - IMPROVED LOGIC
  // Only filter if user explicitly selected filter values from dropdowns
  // Backend already includes filter context in query, so most filtering happens there
  useEffect(() => {
    if (books.length === 0) {
      setFilteredBooks([]);
      return;
    }

    // Check if any filters are actively applied
    const hasFilters = !!(searchForm.language || searchForm.target_audience || 
                          searchForm.book_type || searchForm.content_type || searchForm.reading_level);

    if (!hasFilters) {
      // No filters applied - show all books from backend
      console.log('✅ No filters applied, showing all', books.length, 'books');
      setFilteredBooks(books);
      return;
    }

    console.log('🔍 Applying client-side filters to', books.length, 'books');
    console.log('   Active Filters:', {
      language: searchForm.language || 'none',
      target_audience: searchForm.target_audience || 'none',
      book_type: searchForm.book_type || 'none',
      content_type: searchForm.content_type || 'none',
      reading_level: searchForm.reading_level || 'none'
    });

    // Helper function for case-insensitive comparison
    const matchesFilter = (bookValue: string | undefined | null, filterValue: string | undefined) => {
      if (!filterValue || filterValue.trim() === '') return true; // No filter = pass
      if (!bookValue) return false; // Book missing field = fail
      // Case-insensitive, trim whitespace
      return bookValue.toLowerCase().trim() === filterValue.toLowerCase().trim();
    };

    const filtered = books.filter((book, index) => {
      // Show debug info for first 3 books
      if (index < 3) {
        console.log(`📖 Book ${index + 1}: "${book.title}" by ${book.author}`);
        console.log('   Book metadata:', {
          language: book.language || 'not set',
          target_audience: book.target_audience || 'not set',
          book_type: book.book_type || 'not set',
          content_type: book.content_type || 'not set',
          reading_level: book.reading_level || 'not set'
        });
      }

      // Apply filters with case-insensitive matching
      const passesLanguage = matchesFilter(book.language, searchForm.language);
      const passesAudience = matchesFilter(book.target_audience, searchForm.target_audience);
      const passesBookType = matchesFilter(book.book_type, searchForm.book_type);
      const passesContentType = matchesFilter(book.content_type, searchForm.content_type);
      const passesReadingLevel = matchesFilter(book.reading_level, searchForm.reading_level);

      const passes = passesLanguage && passesAudience && passesBookType && passesContentType && passesReadingLevel;

      if (index < 3) {
        console.log(`   Filter results: ${passes ? '✅ PASS' : '❌ FAIL'}`, {
          language: passesLanguage,
          audience: passesAudience,
          bookType: passesBookType,
          contentType: passesContentType,
          readingLevel: passesReadingLevel
        });
      }

      return passes;
    });

    console.log(`📊 Filter results: ${filtered.length}/${books.length} books matched`);
    
    // Log available values if filtering produced no results
    if (filtered.length === 0) {
      console.log('📈 Available filter values in returned books:');
      const availableValues = {
        languages: [...new Set(books.map(b => b.language).filter(Boolean))],
        target_audiences: [...new Set(books.map(b => b.target_audience).filter(Boolean))],
        book_types: [...new Set(books.map(b => b.book_type).filter(Boolean))],
        content_types: [...new Set(books.map(b => b.content_type).filter(Boolean))],
        reading_levels: [...new Set(books.map(b => b.reading_level).filter(Boolean))]
      };
      console.table(availableValues);
    }

    setFilteredBooks(filtered);
  }, [books, searchForm.language, searchForm.target_audience, searchForm.book_type, searchForm.content_type, searchForm.reading_level]);

  // Load persisted data on component mount
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        // Load saved books
        const savedBooks = localStorage.getItem('bookRecommendations');
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks);
          if (parsedBooks.length > 0) {
            setBooks(parsedBooks);
            setFilteredBooks(parsedBooks);
            toast.success(`Restored ${parsedBooks.length} book recommendations from previous search`, {
              duration: 3000,
              icon: '📚'
            });
          }
        }

        // Load saved search form
        const savedSearchForm = localStorage.getItem('bookSearchForm');
        if (savedSearchForm) {
          const parsedSearchForm = JSON.parse(savedSearchForm);
          setSearchForm(parsedSearchForm);
        }

        // Load saved filters state
        const savedShowFilters = localStorage.getItem('showFilters');
        if (savedShowFilters) {
          setShowFilters(JSON.parse(savedShowFilters));
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    const loadFilters = async () => {
      try {
        const filterData = await booksApi.getFilters();
        setFilters(filterData);
      } catch (error) {
        console.error('Error loading filters:', error);
        toast.error('Failed to load filter options - using defaults');
        // Provide sensible defaults so the filter UI remains usable
        const defaultFilters: FilterOptions = {
          languages: [
            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese'
          ],
          target_audiences: [
            { value: 'children', description: 'Ages 4-12' },
            { value: 'young_adult', description: 'Ages 13-18' },
            { value: 'adult', description: 'Adult readers' },
            { value: 'general', description: 'Suitable for all ages' }
          ],
          book_types: [
            { value: 'fiction', description: 'Fiction' },
            { value: 'non_fiction', description: 'Non-fiction' },
            { value: 'biography', description: 'Biography' }
          ],
          content_types: [
            { value: 'novel', description: 'Novel' },
            { value: 'short_stories', description: 'Short stories' },
            { value: 'poetry', description: 'Poetry' }
          ],
          reading_levels: [
            { value: 'beginner', description: 'Beginner' },
            { value: 'intermediate', description: 'Intermediate' },
            { value: 'advanced', description: 'Advanced' }
          ]
        };
        setFilters(defaultFilters);
      }
    };

    loadPersistedData();
    loadFilters();
  }, []);

  // Save data to localStorage whenever books or searchForm changes
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('bookRecommendations', JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bookSearchForm', JSON.stringify(searchForm));
  }, [searchForm]);

  useEffect(() => {
    localStorage.setItem('showFilters', JSON.stringify(showFilters));
  }, [showFilters]);

  // Fetch saved books on mount
  useEffect(() => {
    if (user) {
      fetchSavedBooks();
    }
  }, [user, fetchSavedBooks]);
  
  // Test API connectivity on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔌 Testing API connection...');
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
        console.log('Auth Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
        console.log('User:', user);
      } catch (error) {
        console.error('❌ API connection test failed:', error);
      }
    };
    testConnection();
  }, [user]);

  // Handle image loading events
  useEffect(() => {
    const handleImageLoaded = () => {
      setImagesLoaded(prev => prev + 1);
    };

    window.addEventListener('bookImageLoaded', handleImageLoaded);
    return () => window.removeEventListener('bookImageLoaded', handleImageLoaded);
  }, []);

  // Reset image loading progress when new results are loaded
  useEffect(() => {
    if (books.length > 0) {
      setImagesLoaded(0);
      setShowImageProgress(true);
      
      // Hide progress after all images are loaded
      const timer = setTimeout(() => {
        if (imagesLoaded >= books.length) {
          setShowImageProgress(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowImageProgress(false);
    }
  }, [books.length, imagesLoaded]);

  // Clear persisted data function
  const clearPersistedData = () => {
    localStorage.removeItem('bookRecommendations');
    localStorage.removeItem('bookSearchForm');
    localStorage.removeItem('showFilters');
    setBooks([]);
    setFilteredBooks([]);
    setSearchForm({
      query: '',
      range: '10-20',
      get_all_available: false,
    });
    setShowFilters(false);
    setImagesLoaded(0);
    setShowImageProgress(false);
    toast.success('Search history cleared');
  };

  const clearFilters = () => {
    setSearchForm(prev => ({
      ...prev,
      language: undefined,
      target_audience: undefined,
      book_type: undefined,
      content_type: undefined,
      reading_level: undefined,
    }));
    toast.success('Filters cleared');
  };

  const hasActiveFilters = () => {
    return !!(searchForm.language || searchForm.target_audience || searchForm.book_type || 
              searchForm.content_type || searchForm.reading_level);
  };

  // Get display limit based on selected range
  const getDisplayLimit = (range: string): number => {
    switch (range) {
      case '10-20': return 20;
      case '20-30': return 30;
      case '30-40': return 40;
      case '40-50': return 50;
      case '50+': return 75;
      case '100+': return 120;
      default: return 20;
    }
  };

  // Get books to display based on range selection
  const getBooksToDisplay = () => {
    const displayLimit = getDisplayLimit(searchForm.range || '10-20');
    return filteredBooks.slice(0, displayLimit);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSearchForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setSearchForm(prev => ({
        ...prev,
        [name]: value === '' ? undefined : value
      }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchForm.query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    console.log('🔍 Starting search with query:', searchForm);
    
    try {
      const recommendations = await booksApi.getRecommendations(searchForm);
      console.log('✅ Received recommendations:', recommendations);
      console.log('📊 Number of books:', recommendations?.length || 0);
      
      if (!recommendations || recommendations.length === 0) {
        console.warn('⚠️ No recommendations returned from API');
        setBooks([]);
        setFilteredBooks([]);
        toast.error('No books found. Try a different search query or adjust your filters.');
        return;
      }
      
      setBooks(recommendations);
      setFilteredBooks(recommendations);
      toast.success(`Found ${recommendations.length} book recommendations! 📚`);
    } catch (error: any) {
      console.error('❌ Search error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || 'Failed to get recommendations';
      
      toast.error(errorMessage);
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBook = async (book: Book) => {
    const bookData = {
      title: book.title,
      author: book.author,
      genre: book.genre || 'Unknown',
      summary: book.description || book.brief_summary || '',
      cover_image_url: book.cover_image_url,
      rating: book.rating,
      isbn: book.isbn,
      publication_year: book.year_published || book.publication_year,
    };
    await saveBook(bookData);
  };

  const handleUnsaveBook = async (title: string, author: string) => {
    const savedBookId = getSavedBookId(title, author);
    if (savedBookId) {
      await removeSavedBook(savedBookId);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className={hideHeader ? "" : "min-h-screen bg-transparent dark:bg-transparent"}>
      {/* Header */}
      {!hideHeader && (
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
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
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


  {/* Search Form */}
  <div className="card mb-8 search-card">
          <form onSubmit={handleSearch}>
            <div className="space-y-6">
              {/* Main Search */}
              <div>
                <label htmlFor="query" className="block text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What kind of books are you looking for?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="query"
                    name="query"
                    value={searchForm.query}
                    onChange={handleInputChange}
                    placeholder="e.g., mystery novels with strong female protagonists..."
                    className="input-field pl-10 text-lg py-3"
                  />
                </div>
              </div>

              {/* Book Range Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <label htmlFor="range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    How many books would you like?
                  </label>
                  <select
                    id="range"
                    name="range"
                    value={searchForm.range || '10-20'}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="10-20">10-20 books</option>
                    <option value="20-30">20-30 books</option>
                    <option value="30-40">30-40 books</option>
                    <option value="40-50">40-50 books</option>
                    <option value="50+">More than 50 books</option>
                    <option value="100+">More than 100 books</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="get_all_available"
                    name="get_all_available"
                    checked={searchForm.get_all_available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="get_all_available" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Get maximum available books
                  </label>
                </div>
              </div>

              {/* Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                  </button>

                  {books.length > 0 && (
                    <button
                      type="button"
                      onClick={clearPersistedData}
                      className="btn-secondary flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Clear all results and reset search"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Clear Results</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2 px-8 py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Find Books</span>
                    </>
                  )}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && filters && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Advanced Filters
                      {hasActiveFilters() && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {Object.values({
                            language: searchForm.language,
                            target_audience: searchForm.target_audience,
                            book_type: searchForm.book_type,
                            content_type: searchForm.content_type,
                            reading_level: searchForm.reading_level,
                          }).filter(Boolean).length} active
                        </span>
                      )}
                    </h3>
                    {hasActiveFilters() && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Language */}
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={searchForm.language || ''}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Any Language</option>
                        {filters.languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>



                    {/* Book Type */}
                    <div>
                      <label htmlFor="book_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Book Type
                      </label>
                      <select
                        id="book_type"
                        name="book_type"
                        value={searchForm.book_type || ''}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Any Type</option>
                        {filters.book_types.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.value.replace('_', ' ').toUpperCase()} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Audience
                      </label>
                      <select
                        id="target_audience"
                        name="target_audience"
                        value={searchForm.target_audience || ''}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Any Audience</option>
                        {filters.target_audiences.map(audience => (
                          <option key={audience.value} value={audience.value}>
                            {audience.value.toUpperCase()} - {audience.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Content Type */}
                    <div>
                      <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content Type
                      </label>
                      <select
                        id="content_type"
                        name="content_type"
                        value={searchForm.content_type || ''}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Any Content</option>
                        {filters.content_types.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.value.replace('_', ' ').toUpperCase()} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reading Level */}
                    <div>
                      <label htmlFor="reading_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reading Level
                      </label>
                      <select
                        id="reading_level"
                        name="reading_level"
                        value={searchForm.reading_level || ''}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Any Level</option>
                        {filters.reading_levels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.value.toUpperCase()} - {level.description}
                          </option>
                        ))}
                      </select>
                    </div>


                  </div>
                </div>
              )}
            </div>
          </form>
        </div>



        {/* Loading State */}
        {isLoading && (
          <div className="mt-8">
            <BookLoadingAnimation />
          </div>
        )}











        {/* Book Results */}
        {books.length > 0 && getBooksToDisplay().length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📚 {(() => {
                    const displayBooks = getBooksToDisplay();
                    const selectedRange = searchForm.range || '10-20';
                    if (filteredBooks.length === books.length) {
                      return `Found ${books.length} Books - Showing ${displayBooks.length} (${selectedRange} range)`;
                    } else {
                      return `Showing ${displayBooks.length} of ${filteredBooks.length} Books (${selectedRange} range)`;
                    }
                  })()}
                </h2>
                {filteredBooks.length !== books.length && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {books.length - filteredBooks.length} books filtered out by search criteria
                  </p>
                )}
                {(() => {
                  const displayBooks = getBooksToDisplay();
                  return displayBooks.length < filteredBooks.length && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      📊 Displaying {displayBooks.length} books as per your selected range ({searchForm.range || '10-20'})
                    </p>
                  );
                })()}
              </div>
              {/* image loading progress removed per user request */}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {getBooksToDisplay().map((book, index) => (
                <div key={index} className="book-card group">
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
                    
                    {/* Save/Unsave Button */}
                    <button
                      onClick={() => {
                        if (isBookSaved(book.title, book.author)) {
                          handleUnsaveBook(book.title, book.author);
                        } else {
                          handleSaveBook(book);
                        }
                      }}
                      className={`absolute top-2 left-2 p-2 rounded-full shadow-lg transition-all duration-200 z-10 ${
                        isBookSaved(book.title, book.author)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                      }`}
                      title={isBookSaved(book.title, book.author) ? 'Remove from saved books' : 'Save to your collection'}
                    >
                      <Heart 
                        className={`h-4 w-4 transition-all duration-200 ${
                          isBookSaved(book.title, book.author) ? 'fill-current' : ''
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Book Info - Better padding and spacing */}
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

                    {/* Summary - Flexible space */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {book.description || book.brief_summary || 'No description available'}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {(book.year_published || book.publication_year) && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{book.year_published || book.publication_year}</span>
                        </div>
                      )}
                      {book.page_count && (
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{book.page_count}p</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom description */}
                    {book.short_description && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
                          {book.short_description}
                        </p>
                      </div>
                    )}

                    {/* Series info */}
                    {book.series_info && (
                      <div className="bg-accent-50 dark:bg-accent-900 px-3 py-2 rounded-lg text-xs text-accent-800 dark:text-accent-200">
                        <div className="flex items-center space-x-1">
                          <span>�</span>
                          <span className="font-medium">Series:</span>
                          <span className="truncate">{book.series_info}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Filtered Results */}
        {books.length > 0 && getBooksToDisplay().length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No books match your filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
              Try adjusting your filter criteria or{' '}
              <button 
                onClick={clearFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                clear all filters
              </button>
              {' '}to see more results.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {books.length} total books available
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Ready to discover amazing books?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter a search query above to get personalized book recommendations powered by AI. 
              Try searches like "mystery novels", "sci-fi for beginners", or "romance with strong heroines".
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookRecommendations;