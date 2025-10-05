import api from './api';

// Types
export interface BookQuery {
  query: string;
  range?: string;
  get_all_available?: boolean;
  language?: string;
  target_audience?: string;
  book_type?: string;
  content_type?: string;
  reading_level?: string;
}

export interface Book {
  title: string;
  author: string;
  genre?: string;
  description: string;
  cover_image_url?: string;
  year_published?: number;
  publisher?: string;
  rating?: number;
  language?: string;
  target_audience?: string;
  book_type?: string;
  content_type?: string;
  reading_level?: string;
  // Aliases for compatibility with varying upstream fields
  pages?: number;
  // Legacy fields for compatibility
  brief_summary?: string;
  short_description?: string;
  publication_year?: number;
  isbn?: string;
  page_count?: number;
  series_info?: string;
}

export interface FilterOption {
  value: string;
  description: string;
}

export interface FilterOptions {
  languages: string[];
  target_audiences: FilterOption[];
  book_types: FilterOption[];
  content_types: FilterOption[];
  reading_levels: FilterOption[];
}

// Books API calls
export const booksApi = {
  getRecommendations: async (query: BookQuery): Promise<Book[]> => {
    // Convert BookQuery format to match backend BookRecommendationRequest
    // Include filter context in the query to help AI generate appropriate books
    let enhancedQuery = query.query;
    
    // Add filter context to the query to guide AI generation
    const filterContext = [];
    if (query.language) filterContext.push(`in ${query.language} language`);
    if (query.target_audience) filterContext.push(`for ${query.target_audience} audience`);
    if (query.book_type) filterContext.push(`${query.book_type} books`);
    if (query.content_type) filterContext.push(`${query.content_type.replace('_', ' ')} format`);
    if (query.reading_level) filterContext.push(`at ${query.reading_level} reading level`);
    
    if (filterContext.length > 0) {
      enhancedQuery = `${query.query} (specifically: ${filterContext.join(', ')})`;
    }
    
    // Convert range to actual count
    const getCountFromRange = (range: string): number => {
      switch (range) {
        case '10-20': return 20;
        case '20-30': return 30;
        case '30-40': return 40;
        case '40-50': return 50;
        case '50+': return 75;
        case '100+': return 120;
        default: return 15;
      }
    };

    const request = {
      query: enhancedQuery,
      count: getCountFromRange(query.range || '10-20')
    };
    
    console.log('📤 Sending request to /books/recommendations:', request);
    const response = await api.post('/books/recommendations', request);
    console.log('📥 Full response object:', response);
    console.log('📦 Response data:', response.data);
    console.log('🔍 Response data type:', typeof response.data);
    console.log('� Response data keys:', Object.keys(response.data || {}));
    
    // Check response structure
    if (response.data?.recommendations) {
      console.log('✅ Found recommendations array:', response.data.recommendations);
      console.log('📊 Number of books in recommendations:', response.data.recommendations.length);
      console.log('📖 First book sample:', response.data.recommendations[0]);
    } else {
      console.warn('⚠️ No recommendations field in response!');
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));
    }
    
    // Handle both response formats (direct array or wrapped in recommendations)
    const books = Array.isArray(response.data) 
      ? response.data 
      : (response.data.recommendations || []);
    
    console.log('✅ Final books array being returned:', books);
    console.log('📊 Total books count:', books.length);
    
    if (books.length > 0) {
      console.log('📚 Sample book structure:', books[0]);
    }
    
    return books;
  },

  getFilters: async (): Promise<FilterOptions> => {
    const response = await api.get('/recommendations/filters');
    return response.data;
  },
};