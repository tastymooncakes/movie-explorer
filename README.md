# Movie Explorer

A modern movie discovery and watchlist management application built with React, TypeScript, and The Movie Database (TMDB) API.

## Features

### Core Functionality
- **Movie Search** - Search through thousands of movies with infinite scroll
- **Movie Details** - Comprehensive movie information including cast, director, trailers, and reviews
- **Personal Watchlist** - Save movies to your personal collection with local storage persistence
- **Smart Sorting** - Sort watchlist by date added, title, release date, or rating
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Robust Error Handling** - Graceful handling of API failures and malformed data

### Technical Highlights
- **Data Validation** - Runtime validation with Zod to handle unstable API responses
- **Partial Data Recovery** - Smart filtering that shows valid movies even when some data is corrupted
- **Infinite Scrolling** - Smooth pagination for search results
- **State Management** - Efficient caching and synchronization with TanStack Query
- **Type Safety** - Full TypeScript implementation with strict type checking

## Tech Stack

### Frontend Framework
- **React 18** - Modern functional components with hooks
- **TypeScript** - Type-safe development with strict mode
- **Vite** - Fast development and optimized production builds

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful SVG icons

### Data Management
- **TanStack Query (React Query)** - Server state management with caching
- **Zod** - Runtime type validation and schema parsing
- **Local Storage** - Client-side persistence for watchlist data

### Routing & Navigation
- **React Router v6** - Client-side routing with nested layouts
- **Conditional Navigation** - Context-aware navigation bar

### API Integration
- **TMDB API** - The Movie Database REST API
- **Custom API Client** - Robust HTTP client with validation
- **Image Optimization** - Responsive image loading with multiple sizes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd movie-explorer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in project root
cp .env.example .env
```

Add your TMDB API key to `.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # App layout with conditional navigation
│   ├── MovieCard.tsx   # Movie display component
│   └── SearchNavigation.tsx # Header navigation
├── hooks/              # Custom React hooks
│   ├── useMovies.ts    # TanStack Query hooks for API calls
│   └── useWatchlist.ts # Watchlist state management
├── pages/              # Route components
│   ├── HomePage.tsx    # Landing page with search
│   ├── SearchResultsPage.tsx # Search results with infinite scroll
│   ├── MovieDetailsPage.tsx  # Individual movie details
│   └── WatchlistPage.tsx     # Personal watchlist management
├── schemas/            # Zod validation schemas
│   └── movie.ts        # API response validation
├── services/           # External service integrations
│   └── tmdb.ts         # TMDB API client
└── types/              # TypeScript type definitions
    └── movie.ts        # Movie-related interfaces
```

## Key Features Explained

### Robust Data Validation
The application implements a sophisticated validation system that handles unstable API responses:

- **Runtime Validation**: All API responses are validated against Zod schemas
- **Partial Recovery**: When some movies in a response are malformed, valid movies are still displayed
- **Graceful Degradation**: Missing or invalid fields are replaced with sensible defaults
- **Developer Feedback**: Console warnings help identify data quality issues

### Watchlist Management
- **Local Persistence**: Watchlist data is stored in browser's localStorage
- **Smart Sorting**: Multiple sorting options with ascending/descending order
- **Statistics**: Real-time calculation of watchlist metrics
- **Bulk Operations**: Clear entire watchlist with confirmation

### Performance Optimizations
- **Infinite Scrolling**: Efficient pagination with Intersection Observer API
- **Image Lazy Loading**: Improved performance with native lazy loading
- **Query Caching**: TanStack Query provides intelligent caching and background updates
- **Bundle Optimization**: Tree-shaking and code splitting for optimal load times

## Error Handling

The application includes comprehensive error handling:

- **API Failures**: Network errors display user-friendly messages
- **Data Validation**: Malformed API responses are filtered and logged
- **Missing Resources**: Graceful fallbacks for missing images or data
- **Route Errors**: 404 handling with navigation options

## License

This project is built for educational purposes and uses The Movie Database API.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [TanStack Query](https://tanstack.com/query) for excellent state management
- [Lucide](https://lucide.dev/) for the icon library