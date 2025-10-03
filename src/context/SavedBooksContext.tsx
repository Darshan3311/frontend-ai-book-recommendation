import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export interface SavedBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  genre: string;
  summary: string;
  cover_image_url?: string;
  rating?: number;
  isbn?: string;
  publication_year?: number;
  saved_at: string;
}

export interface Book {
  title: string;
  author: string;
  genre: string;
  summary: string;
  cover_image_url?: string;
  rating?: number;
  isbn?: string;
  publication_year?: number;
}

interface SavedBooksState {
  savedBooks: SavedBook[];
  isLoading: boolean;
  error: string | null;
}

type SavedBooksAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SAVED_BOOKS'; payload: SavedBook[] }
  | { type: 'ADD_SAVED_BOOK'; payload: SavedBook }
  | { type: 'REMOVE_SAVED_BOOK'; payload: string };

interface SavedBooksContextType {
  savedBooks: SavedBook[];
  isLoading: boolean;
  error: string | null;
  fetchSavedBooks: () => Promise<void>;
  saveBook: (book: Book) => Promise<boolean>;
  removeSavedBook: (bookId: string) => Promise<boolean>;
  isBookSaved: (title: string, author: string) => boolean;
  getSavedBookId: (title: string, author: string) => string | null;
}

const SavedBooksContext = createContext<SavedBooksContextType | undefined>(undefined);

const savedBooksReducer = (state: SavedBooksState, action: SavedBooksAction): SavedBooksState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SAVED_BOOKS':
      return { ...state, savedBooks: action.payload };
    case 'ADD_SAVED_BOOK':
      return { ...state, savedBooks: [action.payload, ...state.savedBooks] };
    case 'REMOVE_SAVED_BOOK':
      return { 
        ...state, 
        savedBooks: state.savedBooks.filter(book => book.id !== action.payload) 
      };
    default:
      return state;
  }
};

export const SavedBooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(savedBooksReducer, {
    savedBooks: [],
    isLoading: false,
    error: null,
  });

  const fetchSavedBooks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await api.get('/saved-books/');
      dispatch({ type: 'SET_SAVED_BOOKS', payload: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch saved books';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const saveBook = useCallback(async (book: Book): Promise<boolean> => {
    try {
      const response = await api.post('/saved-books/', book);
      dispatch({ type: 'ADD_SAVED_BOOK', payload: response.data });
      toast.success(`"${book.title}" saved to your collection!`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Book is already saved to your collection');
        return false;
      }
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to save book';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const removeSavedBook = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      await api.delete(`/saved-books/${bookId}`);
      dispatch({ type: 'REMOVE_SAVED_BOOK', payload: bookId });
      toast.success('Book removed from your collection');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to remove saved book';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const isBookSaved = useCallback((title: string, author: string): boolean => {
    return state.savedBooks.some(book => 
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
  }, [state.savedBooks]);

  const getSavedBookId = useCallback((title: string, author: string): string | null => {
    const savedBook = state.savedBooks.find(book => 
      book.title.toLowerCase() === title.toLowerCase() && 
      book.author.toLowerCase() === author.toLowerCase()
    );
    return savedBook ? savedBook.id : null;
  }, [state.savedBooks]);

  const value: SavedBooksContextType = {
    savedBooks: state.savedBooks,
    isLoading: state.isLoading,
    error: state.error,
    fetchSavedBooks,
    saveBook,
    removeSavedBook,
    isBookSaved,
    getSavedBookId,
  };

  return (
    <SavedBooksContext.Provider value={value}>
      {children}
    </SavedBooksContext.Provider>
  );
};

export const useSavedBooks = (): SavedBooksContextType => {
  const context = useContext(SavedBooksContext);
  if (context === undefined) {
    throw new Error('useSavedBooks must be used within a SavedBooksProvider');
  }
  return context;
};