import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { MoviesResponse } from '../types/movie';
import { tmdbClient } from '@/services/tmdb';

export const useSearchMovies = (query: string) => {
    return useInfiniteQuery({
        queryKey: ['movies', 'search', query],
        queryFn: ({ pageParam }) => tmdbClient.searchMovies(query, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage: MoviesResponse) => {
            return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
        },
        enabled: query.length > 0,
        staleTime: 10 * 60 * 1000,
    })
}

export const useMovieDetails = (movieId: number) => {
    return useQuery({
        queryKey: ['movie', 'details', movieId],
        queryFn: () => tmdbClient.getMovieDetails(movieId),
        enabled: !!movieId,
    })
}

export const useMovieCredits = (movieId: number) => {
    return useQuery({
        queryKey: ['movie', 'credits', movieId],
        queryFn: () => tmdbClient.getMovieCredits(movieId),
        enabled: !!movieId,
    })
}

export const useMovieVideo = (movieId: number) => {
    return useQuery({
        queryKey: ['movie', 'video', movieId],
        queryFn: () => tmdbClient.getMovieVideos(movieId),
        enabled: !!movieId,
    })
}

export const useMovieReview = (movieId: number) => {
    return useQuery({
        queryKey: ['movie', 'review', movieId],
        queryFn: () => tmdbClient.getMovieReviews(movieId),
        enabled: !!movieId,
    })
}
