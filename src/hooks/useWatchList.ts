import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types/movie';

// Watchlist item type (extends Movie with date added)
export interface WatchlistItem extends Movie {
  dateAdded: string; // ISO date string
}

// Sorting options for watchlist
export type SortOption = 'dateAdded' | 'title' | 'releaseDate' | 'rating';
export type SortDirection = 'asc' | 'desc';

const STORAGE_KEY = 'moviedb-watchlist';

// Storage utility with fallback
const storage = {
  getItem: (key: string): string | null => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        return item;
      }
      // Fallback to sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const item = sessionStorage.getItem(key);
        return item;
      }
    } catch (error) {
      console.error('Storage read error:', error);
    }
    return null;
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      // Try localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
      // Fallback to sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.error('Storage write error:', error);
    }
    return false;
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
};

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from storage on mount
  useEffect(() => {
    
    try {
      const saved = storage.getItem(STORAGE_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved) as WatchlistItem[];
        
        // Validate the data structure
        const validItems = parsed.filter(item => 
          item && 
          typeof item === 'object' && 
          item.id && 
          item.title && 
          item.dateAdded
        );
        
        if (validItems.length !== parsed.length) {
          console.warn('Some watchlist items were invalid and filtered out');
        }
        
        setWatchlist(validItems);
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
      // Start fresh if there's an error
      setWatchlist([]);
      // Clear corrupted data
      storage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save watchlist to storage whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    
    
    try {
      const serialized = JSON.stringify(watchlist);
      const success = storage.setItem(STORAGE_KEY, serialized);
      
      if (success) {        
        // Verify the save worked by reading it back
        setTimeout(() => {
          const verification = storage.getItem(STORAGE_KEY);
          if (verification) {
          } else {
            console.error('Save verification failed - data not persisted');
          }
        }, 100);
      } else {
        console.error('Failed to save watchlist');
      }
    } catch (error) {
      console.error('Failed to save watchlist:', error);
    }
  }, [watchlist, isLoaded]);

  // Add movie to watchlist
  const addToWatchlist = useCallback((movie: Movie) => {    
    const watchlistItem: WatchlistItem = {
      ...movie,
      dateAdded: new Date().toISOString(),
    };

    setWatchlist(prev => {
      // Check if movie is already in watchlist
      if (prev.some(item => item.id === movie.id)) {
        return prev;
      }
      return [...prev, watchlistItem];
    });
  }, []);

  // Remove movie from watchlist
  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  }, []);

  // Check if movie is in watchlist
  const isInWatchlist = useCallback((movieId: number) => {
    const inList = watchlist.some(item => item.id === movieId);
    return inList;
  }, [watchlist]);

  // Toggle movie in watchlist
  const toggleWatchlist = useCallback((movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  }, [isInWatchlist, removeFromWatchlist, addToWatchlist]);

  // Sort watchlist
  const sortedWatchlist = useCallback(() => {
    const sorted = [...watchlist].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'releaseDate':
          comparison = new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
          break;
        case 'rating':
          comparison = a.vote_average - b.vote_average;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [watchlist, sortBy, sortDirection]);

  // Update sorting
  const updateSort = useCallback((newSortBy: SortOption, newDirection?: SortDirection) => {
    setSortBy(newSortBy);
    if (newDirection) {
      setSortDirection(newDirection);
    } else {
      // If same sort field, toggle direction
      if (newSortBy === sortBy) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        // Default direction for new sort field
        setSortDirection(newSortBy === 'dateAdded' ? 'desc' : 'asc');
      }
    }
  }, [sortBy]);

  // Clear entire watchlist
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  // Get watchlist statistics
  const watchlistStats = useCallback(() => {
    const totalMovies = watchlist.length;

    return {
      totalMovies,
    };
  }, [watchlist]);

  return {
    // Data
    watchlist: sortedWatchlist(),
    rawWatchlist: watchlist, // Unsorted for internal use
    isLoaded, // Loading state
    
    // Actions
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    
    // State checks
    isInWatchlist,
    
    // Sorting
    sortBy,
    sortDirection,
    updateSort,
    
    // Stats
    watchlistStats: watchlistStats(),
  };
}