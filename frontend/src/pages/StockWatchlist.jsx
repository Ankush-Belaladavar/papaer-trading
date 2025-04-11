import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StockWatchlist = ({ userId }) => {
  const [watchlist, setWatchlist] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Function to fetch the watchlist including updated prices
  const fetchWatchlist = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/watchlist/${currentUser.id}`);
      setWatchlist(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setWatchlist([]);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWatchlist();

    // Set interval to update prices every 60 seconds (60000 ms)
    const interval = setInterval(() => {
      fetchWatchlist();
    }, 60000);

    return () => clearInterval(interval);
  }, [userId, currentUser.id]);

  // const handleSuggestionClick = (symbol, name) => {
  //   navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}`);
  // };

  const handleSuggestionClick = (symbol, name) => {
    const newEntry = { symbol, name };
    const existing = JSON.parse(localStorage.getItem('recentlyVisited')) || [];
  
    const filtered = existing.filter(item => item.symbol !== symbol);
    const updated = [newEntry, ...filtered].slice(0, 10);
  
    localStorage.setItem('recentlyVisited', JSON.stringify(updated));
  
    navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}`);
  };
  

  return (
    <div className="watchlist-list">
      {watchlist.length > 0 ? (
        watchlist.map((stock) => (
          <div key={stock._id} className="watchlist-item">
            <div
              className="stock-info"
              onClick={() => handleSuggestionClick(stock.symbol, stock.companyName)}
            >
              <h3 className="stock-name">{stock.companyName}</h3>
              {/* Display the current price */}
              <p className="stock-symbol">{stock.currentPrice}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No stocks in your watchlist.</p>
      )}
    </div>
  );
};

export default StockWatchlist;
