import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails, useMovieCredits, useMovieReview, useMovieVideo } from '../hooks/useMovies';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Star, Calendar, Play, Check, Plus } from 'lucide-react';
import { getPosterUrl, getProfileUrl } from '../services/tmdb';
import { useWatchlist } from '@/hooks/useWatchList';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = parseInt(id || '0');

  // Fetch all movie data using your React Query hooks
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideo(movieId);
  const { data: reviews } = useMovieReview(movieId);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();


  // Loading state
  if (movieLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Loading movie details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:text-black mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-gray-400 mb-6">
              Sorry, we couldn't find the movie you're looking for.
            </p>
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDirector = () => {
    return credits?.crew.find(person => person.job === 'Director');
  };

  const getTrailer = () => {
    return videos?.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
  };

  const handleWatchlistToggle = () => {
    if (movie) {
      toggleWatchlist(movie);
    }
  };

  const director = getDirector();
  const trailer = getTrailer();
  const mainCast = credits?.cast.slice(0, 8) || [];
  const inWatchlist = isInWatchlist(movieId);


  return (
    <div className="min-h-screen bg-black text-white">
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

        {/* Movie Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="w-80 max-w-full">
              {movie.poster_path ? (
                <img
                  src={getPosterUrl(movie.poster_path)!}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Poster Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Movie Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-6">"{movie.tagline}"</p>
            )}

            {/* Movie Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
              </div>
              
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>

            {/* Director */}
            {director && (
              <div className="mb-6">
                <span className="text-gray-400">Directed by </span>
                <span className="text-white font-semibold">{director.name}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className={`${
                  inWatchlist 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
              
              {trailer && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-black hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Trailer
                </Button>
              )}
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {mainCast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {mainCast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                    {actor.profile_path ? (
                      <img
                        src={getProfileUrl(actor.profile_path)!}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Photo</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{actor.name}</h3>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {reviews && reviews.results.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-6">
              {reviews.results.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="font-semibold">{review.author}</div>
                    {review.author_details.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{review.author_details.rating}/10</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 line-clamp-4">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Info */}
        <section className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {movie.budget > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Budget</h3>
                <p className="text-gray-300">{formatCurrency(movie.budget)}</p>
              </div>
            )}
            
            {movie.revenue > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Box Office</h3>
                <p className="text-gray-300">{formatCurrency(movie.revenue)}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-gray-300">{movie.status}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}