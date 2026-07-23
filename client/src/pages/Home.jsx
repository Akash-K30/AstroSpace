import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getNews, searchNews } from '../services/news.services';
import NewsCard from '../components/news/Newscard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, onRequireAuth } = useAuth();
  const navigate = useNavigate();

  // State for news data and pagination
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // State for search and filters[cite: 1]
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    source: '',
    sort: 'latest' // Default sort from API doc[cite: 1]
  });

  // Fetch news whenever page or filters change
  const fetchNews = useCallback(async (isNewSearch = false) => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters based on current state[cite: 1]
      const params = {
        page: isNewSearch ? 1 : page,
        limit: 12, // Default limit from API doc[cite: 1]
        ...(filters.q && { q: filters.q }),
        ...(filters.source && { source: filters.source }),
        ...(filters.sort && { sort: filters.sort }),
      };

      const data = await getNews(params);

      if (isNewSearch) {
        setArticles(data);
      } else {
        setArticles((prev) => [...prev, ...data]);
      }

      // If the backend returns fewer items than the limit, we've reached the end
      if (data.length < 12) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to load news articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // Trigger fetch on mount or when page/filters change
  useEffect(() => {
    // If page is 1, it's treated as a new search to replace articles
    fetchNews(page === 1);
  }, [page, filters, fetchNews]);

  // Handlers for filter changes
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, q: e.target.value }));
    setPage(1); // Reset to first page on new search[cite: 1]
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page on filter change[cite: 1]
  };



  return (
    <div className="home-container">

      {/* Filter and Search Bar Section[cite: 1] */}
      <section className="filter-bar">
        <input
          type="text"
          placeholder="Search news (e.g., mars)..."
          value={filters.q}
          onChange={handleSearchChange}
          className="search-input"
        />

      
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </section>

      {/* Error State */}
      {error && <div className="error-message">{error}</div>}

      {/* News Grid */}
      <section className="news-grid">
        {articles.map((article) => (
          <NewsCard 
            key={article._id} 
            article={article} 
            
          />
        ))}
      </section>

      {/* Loading State & Pagination[cite: 1] */}
      <div className="pagination-container">
        {loading && <p>Loading articles...</p>}
        {!loading && hasMore && (
          <button 
            onClick={() => setPage((prev) => prev + 1)}
            className="load-more-btn"
          >
            Load More
          </button>
        )}
        {!loading && !hasMore && articles.length > 0 && (
          <p>You have caught up on all the news!</p>
        )}
        {!loading && articles.length === 0 && (
          <p>No articles found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Home;