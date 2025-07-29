import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-700 mb-4">404</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-gray-400 hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/watchlist')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              My Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}