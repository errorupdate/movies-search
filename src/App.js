import React, { useState } from "react";
import MovieGrid from "./MovieGrid";
import "./App.css";

const API_KEY = "d3dc7484";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch movie suggestions as user types
  const fetchSuggestions = async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(q)}&apikey=${API_KEY}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setSuggestions(data.Search.slice(0, 6));
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    }
  };

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setMovies([]);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          query
        )}&apikey=${API_KEY}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        // Fetch IMDb ratings for each movie
        const moviesWithRatings = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const res2 = await fetch(
                `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`
              );
              const details = await res2.json();
              return { ...movie, imdbRating: details.imdbRating };
            } catch {
              return { ...movie, imdbRating: undefined };
            }
          })
        );
        setMovies(moviesWithRatings);
      } else {
        setError("No movies found");
      }
    } catch {
      setError("Error fetching data");
    }
    setLoading(false);
  };

  // ...no modal or advanced features...

  return (
    <div className="app-bg">
      <div className="decorative-bg decorative-bg-1" />
      <div className="decorative-bg decorative-bg-2" />
      <div className="container">
        <h1 className="app-title">
          <span role="img" aria-label="clapper" className="emoji-clapper">
            🎬
          </span>
          <span className="app-title-text">Movie Search App</span>
          <span role="img" aria-label="popcorn" className="emoji-popcorn">
            🍿
          </span>
        </h1>
        <div className="title-underline" />
        <form className="search-form" onSubmit={searchMovies}>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search for a movie..."
              className="search-input"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s) => (
                  <li
                    key={s.imdbID}
                    className="suggestion-item"
                    onMouseDown={() => {
                      setQuery(s.Title);
                      setSuggestions([]);
                    }}
                  >
                    <img
                      src={
                        s.Poster !== "N/A"
                          ? s.Poster
                          : "https://via.placeholder.com/40x60?text=No+Image"
                      }
                      alt={s.Title}
                      className="suggestion-img"
                    />
                    <span className="suggestion-title">{s.Title}</span>
                    <span className="suggestion-year">{s.Year}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="search-btn">
            <span role="img" aria-label="search" className="search-btn-emoji">
              🔍
            </span>
            Search
          </button>
        </form>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <MovieGrid movies={movies} />
        {!loading && !error && movies.length === 0 && (
          <div className="start-message">Start searching for movies above!</div>
        )}
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Movie Search App &mdash; Powered by
        OMDB API
      </footer>
    </div>
  );
}

export default App;
