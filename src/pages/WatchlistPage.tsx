import { useWatchlist, type SortOption } from '../hooks/useWatchList';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WatchlistPage() {
  const { 
    watchlist, 
    sortBy, 
    sortDirection, 
    updateSort, 
    clearWatchlist,
    removeFromWatchlist,
    watchlistStats 
  } = useWatchlist();

  const navigate = useNavigate();


  const handleSortChange = (value: string) => {
    updateSort(value as SortOption);
  };

  const handleRemoveMovie = (movieId: number, movieTitle: string) => {
    if (confirm(`Remove "${movieTitle}" from your watchlist?`)) {
      removeFromWatchlist(movieId);
    }
  };

  const getSortLabel = (option: SortOption) => {
    const labels = {
      dateAdded: 'Date Added',
      title: 'Title',
      releaseDate: 'Release Date',
      rating: 'Rating'
    };
    return labels[option];
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:text-black mb-6"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">My Watchlist</h1>
        
        {watchlist.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>{watchlistStats.totalMovies} movies</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="flex items-center">
                <span className="text-gray-400 text-sm mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="releaseDate">Release Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSort(sortBy)}
                  className="text-gray-400 hover:text-black"
                  title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </Button>
              </div>

              {/* Clear All Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire watchlist?')) {
                    clearWatchlist();
                  }
                }}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {watchlist.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your watchlist is empty
          </h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Start building your watchlist by searching for movies and clicking the "Add to Watchlist" button.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Discover Movies
          </Button>
        </div>
      ) : (
        <>
          {/* Sort Info */}
          <div className="mb-6 text-gray-400 text-sm">
            Showing {watchlist.length} movies sorted by {getSortLabel(sortBy)} 
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                
                {/* Remove Button Overlay */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent movie card click
                      handleRemoveMovie(movie.id, movie.title);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 h-8 w-8"
                    title={`Remove ${movie.title} from watchlist`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Date Added Info */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    Added {new Date(movie.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}