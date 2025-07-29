import type { 
  MoviesResponse, 
  MovieDetails, 
  Credits, 
  VideosResponse, 
  ReviewsResponse 
} from '../types/movie';

import { 
  MoviesResponseSchema,
  MovieDetailsSchema,
  CreditsSchema,
  VideosResponseSchema,
  ReviewsResponseSchema,
  MovieSchema
} from '../schema/movie';

// Environment variables with runtime validation
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// Runtime check for missing environment variables
if (!API_KEY) {
  throw new Error('VITE_TMDB_API_KEY is not defined in environment variables');
}

if (!BASE_URL) {
  throw new Error('VITE_TMDB_BASE_URL is not defined in environment variables');
}

// Custom error class for validation failures
export class ValidationError extends Error {
  originalData: any;
  
  constructor(message: string, originalData: any) {
    super(message);
    this.name = 'ValidationError';
    this.originalData = originalData;
  }
}

function validateMoviesResponseRobust(data: any): MoviesResponse {
  try {
    // First try normal validation
    return MoviesResponseSchema.parse(data);
  } catch (error) {
    console.warn('Full validation failed, attempting partial recovery:', error);
    
    // If full validation fails, try to salvage what we can
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      const validMovies = [];
      
      // Filter through each movie and only keep valid ones
      for (const movie of data.results) {
        try {
          const validMovie = MovieSchema.parse(movie);
          validMovies.push(validMovie);
        } catch (movieError) {
          console.warn('Skipping invalid movie:', movie.id || 'unknown', movieError);
          // Continue to next movie instead of failing
        }
      }
      
      // Return a partial response with valid movies
      const partialResponse: MoviesResponse = {
        page: typeof data.page === 'number' ? data.page : 1,
        results: validMovies,
        total_pages: typeof data.total_pages === 'number' ? data.total_pages : 1,
        total_results: typeof data.total_results === 'number' ? data.total_results : validMovies.length,
      };
      
      console.info(`Recovered ${validMovies.length} valid movies out of ${data.results.length} total`);
      return partialResponse;
    }
    
    // If we can't salvage anything, throw the original error
    throw new ValidationError('Complete data validation failure - no valid movies found', data);
  }
}

function validateCreditsRobust(data: any): Credits {
  try {
    return CreditsSchema.parse(data);
  } catch (error) {
    console.warn('Credits validation failed, attempting partial recovery:', error);
    
    // Return partial credits with filtered arrays
    const partialCredits: Credits = {
      cast: Array.isArray(data?.cast) ? data.cast.filter((actor: any) => {
        try {
          return typeof actor === 'object' && 
                 typeof actor.id === 'number' && 
                 typeof actor.name === 'string';
        } catch {
          return false;
        }
      }) : [],
      crew: Array.isArray(data?.crew) ? data.crew.filter((crew: any) => {
        try {
          return typeof crew === 'object' && 
                 typeof crew.id === 'number' && 
                 typeof crew.name === 'string';
        } catch {
          return false;
        }
      }) : [],
    };
    
    console.info(`Recovered ${partialCredits.cast.length} cast + ${partialCredits.crew.length} crew members`);
    return partialCredits;
  }
}

// API client with Zod validation
class TMDBClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, 
    params: Record<string, string | number | boolean> = {},
    validator?: (data: any) => T
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add API key to all requests
    url.searchParams.append('api_key', this.apiKey);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    console.log('Making request to:', endpoint);

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();

      // Validate data if validator provided
      if (validator) {
        try {
          const validatedData = validator(rawData);
          return validatedData;
        } catch (validationError) {
          console.error('Validation failed for:', endpoint);
          console.error('Validation error:', validationError);
          console.error('Raw data that failed validation:', rawData);
          
          throw new ValidationError(
            `Data validation failed for ${endpoint}. The API response doesn't match expected structure.`,
            rawData
          );
        }
      }

      return rawData as T;
    } catch (error) {
      console.error('TMDB API Request failed:', error);
      throw error;
    }
  }

  // Search movies with validation
  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    return this.request<MoviesResponse>(
      '/search/movie',
      {
        query: query.trim(),
        page,
        include_adult: false,
      },
      validateMoviesResponseRobust
    );
  }

  // Movie details with validation
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.request<MovieDetails>(
      `/movie/${movieId}`,
      {},
      (data) => MovieDetailsSchema.parse(data) as any
    );
  }

  // Movie credits with validation
  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.request<Credits>(
      `/movie/${movieId}/credits`,
      {},
      validateCreditsRobust
    );
  }

  // Movie videos with validation
  async getMovieVideos(movieId: number): Promise<VideosResponse> {
    return this.request<VideosResponse>(
      `/movie/${movieId}/videos`,
      {},
      (data) => VideosResponseSchema.parse(data) as any
    );
  }

  // Movie reviews with validation
  async getMovieReviews(movieId: number, page: number = 1): Promise<ReviewsResponse> {
    return this.request<ReviewsResponse>(
      `/movie/${movieId}/reviews`,
      { page },
      (data) => ReviewsResponseSchema.parse(data) as any
    );
  }
}

// Create and export the client instance
export const tmdbClient = new TMDBClient(BASE_URL, API_KEY);

// Helper functions for image URLs
export const getImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string | null => {
  return getImageUrl(path, 'w500');
};

export const getBackdropUrl = (path: string | null): string | null => {
  return getImageUrl(path, 'w1280');
};

export const getProfileUrl = (path: string | null): string | null => {
  return getImageUrl(path, 'w185');
};