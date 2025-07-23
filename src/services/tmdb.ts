import type { MoviesResponse, MovieDetails, Credits, VideosResponse, ReviewsResponse } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

if (!API_KEY) {
    throw new Error('VITE_TMDB_API_KEY is not defined in environment variables')
}

if (!BASE_URL) {
    throw new Error('VITE_TMDB_BASE_URL is not defined in environment variables')
}

class TMDBClient {
    private baseURL: string;
    private apiKey: string;

    constructor(baseURL: string, apiKey: string) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }

    private async request<T>(endpoint: string, params: Record<string, string | number | boolean> = {}) : Promise<T> {
        const url = new URL(`${this.baseURL}${endpoint}`)

        url.searchParams.append('api_key', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        })

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json();
            return data
        }
        catch (error) {
            console.error('TMDB API Request Failed: ', error)
            throw error;
        }
    }

    async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
        return this.request<MoviesResponse>('/search/movie', {
            query: query.trim(),
            page,
            include_adult: false,
        })
    }

    async getMovieDetails(movieId: number) {
        return this.request(`/movie/${movieId}`)
    }

    async getMovieCredits(movieId: number) {
        return this.request(`/movie/${movieId}/credits`)
    }

    async getMovieVideos(movieId: number) {
        return this.request(`/movie/${movieId}/videos`)
    }
    
    async getMovieReviews(movieId: number, page: number = 1) {
        return this.request(`/movie/${movieId}/reviews`, { page })
    }
}

export const tmdbClient = new TMDBClient(BASE_URL, API_KEY);

export const getPosterUrl = (path: string | null): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/w500${path}`;
};