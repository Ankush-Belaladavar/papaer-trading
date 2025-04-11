import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentlyVisited.css';

const RECENTLY_VISITED_KEY = 'recentlyVisited';

const RecentlyVisited = () => {
  const [recent, setRecent] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENTLY_VISITED_KEY)) || [];
    setRecent(stored);
  }, []);

  const handleClick = (symbol, name) => {
    navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}&name=${encodeURIComponent(name)}`);
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-4 relative">
      {recent.length === 0 ? (
        <p className="text-gray-500">No recently visited items.</p>
      ) : (
        <div className="carousel-wrapper">
          <button className="scroll-button left" onClick={() => scroll('left')}>&lt;</button>
          <ul className="space-y-2 no-scrollbar" ref={scrollRef}>
            {recent.map(({ symbol, name }, index) => (
              <li
                key={`${symbol}-${index}`}
                onClick={() => handleClick(symbol, name)}
                className="cursor-pointer"
              >
                <span className="font-medium">{name}</span>
              </li>
            ))}
          </ul>
          <button className="scroll-button right" onClick={() => scroll('right')}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default RecentlyVisited;
