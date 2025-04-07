
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

// Added a profile section, which provides a dopdown div
import Profile from '../components/Profile/Profile';

// Adding CurrentUser as a parameter to Navbar function
const Navbar = ({ onLogout,currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const MIN_QUERY_LENGTH = 2;

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery.length >= MIN_QUERY_LENGTH) {
        setIsSearching(true);
        try {
          const proxyUrl = 'https://api.allorigins.win/get?url=';
          const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(trimmedQuery)}&quotesCount=8&newsCount=0`;
          const response = await fetch(proxyUrl + encodeURIComponent(url));
          
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          const results = JSON.parse(data.contents);
          
          const stocks = results.quotes
            .filter(q => q.symbol.endsWith('.NS'))
            .map(q => ({
              symbol: q.symbol,
              name: q.shortname || q.longname || q.symbol,
            }));

          setSearchResults(stocks);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSuggestionClick = (symbol, name) => {
    navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home2">PaperTrade</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home2">Home</Link></li>
        {/* <li><Link to="/home2">Market</Link></li> */}
        {/* <li><Link to="/about">About</Link></li> */}
        {/* <li><Link to="/profile">Profile</Link></li> */}
        <li><Link to="/portfolio">Portfolio</Link></li>
        {/* <li><Link to="/orders">Orders</Link></li> */}

      </ul>
      <div className="navbar-search-container">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search NSE Stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Stock search input"
          />
          {isSearching && (
            <div className="search-loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          )}
          {searchResults.length > 0 ? (
            <div className="search-results-dropdown">
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="search-result-item"
                  onClick={() => handleSuggestionClick(stock.symbol, stock.name)}
                >
                  <div className="stock-info">
                    <span className="stock-symbol">
                      {stock.symbol.replace('.NS', '')}
                    </span>
                    <span className="stock-name">
                      {stock.name}
                    </span>
                  </div>
                  <span className="stock-exchange">NSE</span>
                </div>
              ))}
            </div>
          ) : searchQuery.length > 0 && searchQuery.length < MIN_QUERY_LENGTH ? (
            <div className="search-results-dropdown">
              <div className="search-info-message">
                Keep typing... (minimum {MIN_QUERY_LENGTH} characters)
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="navbar-actions">
        {/* Profile Component */}
        {/* Passing CurrentUser to Profile - Next go to Profile.jsx */}
        <Profile onLogout={handleLogout} currentUser={currentUser} />
      </div>
    </nav>
  );
};

export default Navbar;