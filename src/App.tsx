import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Layout from "./components/Layout";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import { WatchListPage } from "./pages/WatchlistPage";

function App() {
  
  return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="movie/:id" element={<MovieDetailsPage />} />
            <Route path='/watchlist' element={<WatchListPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
  );
}

export default App;