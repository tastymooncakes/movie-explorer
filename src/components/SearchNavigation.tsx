import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, Home, Bookmark } from 'lucide-react';

export function SearchNavigation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(currentQuery);

  // Update search input when URL query changes
  useEffect(() => {
    setSearchInput(currentQuery);
  }, [currentQuery]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim() !== currentQuery) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  }, [searchInput, currentQuery, navigate]);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleWatchlistClick = useCallback(() => {
    navigate('/watchlist');
  }, [navigate]);

  return (
    <div className="bg-black border-b border-gray-700 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Home Button */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Go to home"
          >
            <Home className="w-6 h-6" />
          </button>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for movies..."
                className="pl-10 h-12 bg-black rounded-full border-gray-600 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              />
            </div>
          </form>

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistClick}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Go to watchlist"
          >
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}