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
  ReviewsResponseSchema
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
          console.log('✅ Data validation successful for:', endpoint);
          return validatedData;
        } catch (validationError) {
          console.error('❌ Validation failed for:', endpoint);
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
      (data) => MoviesResponseSchema.parse(data) as any
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
      (data) => CreditsSchema.parse(data) as any
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