import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Layout from "./components/Layout";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  
  return (
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="movie/:id" element={<MovieDetailsPage />} />
            <Route path='/watchlist' element={<WatchlistPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
  );
}

export default App;