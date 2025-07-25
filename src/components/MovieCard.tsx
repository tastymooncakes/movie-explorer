import type { Movie } from '@/types/movie';
import { getPosterUrl } from '@/services/tmdb';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const posterUrl = getPosterUrl(movie.poster_path);
  
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatReleaseYear = (dateString: string) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="aspect-[2/3] relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-center p-4">No Image Available</span>
          </div>
        )}
        
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            ⭐ {formatRating(movie.vote_average)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs mb-2">
          {formatReleaseYear(movie.release_date)}
        </p>
        {movie.overview && (
          <p className="text-gray-300 text-xs line-clamp-3">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}