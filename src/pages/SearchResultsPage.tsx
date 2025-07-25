import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '@/hooks/useMovies';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useSearchMovies(query);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const currentRef = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  if (isLoading) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Searching for "{query}"...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-400 text-lg">
              Error searching for movies: {error?.message}
            </div>
          </div>
        </div>
    );
  }

  const allMovies = data?.pages.flatMap(page => page.results) || [];
  const totalResults = data?.pages[0]?.total_results || 0;

  if (allMovies.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400 text-lg">
              No movies found for "{query}"
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400">
            Found {totalResults.toLocaleString()} results
          </p>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {isFetchingNextPage ? (
            <div className="text-white">Loading more movies...</div>
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Load More
            </Button>
          )}
        </div>
      )}

      {!hasNextPage && allMovies.length > 0 && (
        <div className="text-center mt-8 text-gray-400">
          You've reached the end of the results
        </div>
      )}
      </div>
  );
}