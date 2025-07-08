import React, { useState } from "react";

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #fffbe7 100%)",
        position: "relative",
        overflowX: "hidden", // Prevent horizontal scrolling
        width: "100vw", // Ensure no accidental overflow
        boxSizing: "border-box",
        scrollBehavior: "smooth", // Enable smooth scrolling
        transition: "background 0.6s cubic-bezier(0.4,0,0.2,1)", // Smooth background transitions
        WebkitOverflowScrolling: "touch", // iOS smooth scrolling
      }}
    >
      {/* Decorative background shapes */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, #a5b4fc 60%, transparent 100%)",
          borderRadius: "50%",
          zIndex: 0,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 350,
          height: 350,
          background: "radial-gradient(circle, #fde68a 60%, transparent 100%)",
          borderRadius: "50%",
          zIndex: 0,
          filter: "blur(12px)",
        }}
      />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: 44,
            fontWeight: 900,
            textAlign: "center",
            marginBottom: 28,
            letterSpacing: 2,
            color: "#1e293b",
            background: "none",
            textShadow:
              "0 4px 32px #6366f155, 0 2px 0 #fde68a, 0 1px 0 #fff, 0 0 8px #a5b4fc55",
            padding: "12px 0 18px 0",
            borderRadius: 18,
            position: "relative",
            zIndex: 2,
            boxShadow: "0 2px 24px #6366f122, 0 1.5px 0 #fde68a55",
            overflow: "visible",
          }}
        >
          <span
            role="img"
            aria-label="clapper"
            style={{
              marginRight: 14,
              fontSize: 54,
              verticalAlign: "middle",
              filter: "drop-shadow(0 4px 16px #a5b4fc88)",
              position: "relative",
              top: 2,
            }}
          >
            🎬
          </span>
          <span
            style={{
              letterSpacing: 3,
              fontFamily: "Poppins, Montserrat, Arial Black, sans-serif",
              textTransform: "uppercase",
              fontWeight: 900,
              color: "#1e293b",
              display: "inline-block",
              padding: "0 8px",
              textShadow: "0 2px 16px #a5b4fc55, 0 1px 0 #fff",
            }}
          >
            Movie Search App
          </span>
          <span
            style={{
              display: "inline-block",
              marginLeft: 14,
              fontSize: 32,
              verticalAlign: "middle",
              filter: "drop-shadow(0 2px 8px #fde68a88)",
              animation: "spin 2.5s linear infinite",
            }}
            role="img"
            aria-label="popcorn"
          >
            🍿
          </span>
        </h1>
        {/* Decorative title underline */}
        <div
          style={{
            width: 220,
            height: 10,
            margin: "-18px auto 18px auto",
            background: "linear-gradient(90deg, #fde68a 0%, #6366f1 100%)",
            borderRadius: 8,
            boxShadow: "0 2px 12px #fde68a55, 0 1px 0 #fff",
            opacity: 0.85,
          }}
        />
        <form
          onSubmit={searchMovies}
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            justifyContent: "center",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px #a5b4fc22",
            padding: 16,
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search for a movie..."
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 10,
                border: "1.5px solid #a5b4fc",
                fontSize: 18,
                background: "#f1f5f9",
                boxShadow: "0 1px 4px #a5b4fc11",
                outline: "none",
                transition: "border 0.2s",
              }}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1.5px solid #a5b4fc",
                  borderRadius: 10,
                  boxShadow: "0 4px 24px #a5b4fc22",
                  zIndex: 10,
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  maxHeight: 260,
                  overflowY: "auto",
                }}
              >
                {suggestions.map((s) => (
                  <li
                    key={s.imdbID}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "#fff",
                      transition: "background 0.15s",
                    }}
                    onMouseDown={() => {
                      setQuery(s.Title);
                      setSuggestions([]);
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#e0e7ff")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <img
                      src={
                        s.Poster !== "N/A"
                          ? s.Poster
                          : "https://via.placeholder.com/40x60?text=No+Image"
                      }
                      alt={s.Title}
                      style={{
                        width: 32,
                        height: 44,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginRight: 8,
                        border: "1px solid #a5b4fc33",
                      }}
                    />
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#6366f1",
                        fontSize: 16,
                      }}
                    >
                      {s.Title}
                    </span>
                    <span
                      style={{
                        color: "#a5b4fc",
                        fontSize: 14,
                        marginLeft: "auto",
                      }}
                    >
                      {s.Year}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              background: "linear-gradient(90deg, #6366f1 0%, #fde68a 100%)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              fontSize: 18,
              boxShadow: "0 2px 8px #6366f122",
              cursor: "pointer",
              letterSpacing: 1,
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span role="img" aria-label="search" style={{ marginRight: 8 }}>
              🔍
            </span>
            Search
          </button>
        </form>
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: "#6366f1",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 1,
              margin: "32px 0",
            }}
          >
            Loading...
          </div>
        )}
        {error && (
          <div
            style={{
              textAlign: "center",
              color: "#d97706",
              fontWeight: 600,
              fontSize: 18,
              margin: "24px 0",
            }}
          >
            {error}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${
              Math.min(movies.length, 5) || 1
            }, 1fr)`,
            gap: 28,
            justifyContent: "center",
            marginTop: 32,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 18,
            boxShadow: "0 2px 16px #fde68a33",
            padding: 24,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              style={{
                width: "100%",
                minHeight: 340,
                background: "linear-gradient(135deg, #fff 60%, #fef9c3 100%)",
                borderRadius: 18,
                boxShadow: "0 4px 24px #6366f122, 0 1.5px 0 #fde68a55",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transition: "box-shadow 0.2s, transform 0.1s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 32px #6366f144, 0 2px 0 #fde68a88";
                e.currentTarget.style.transform =
                  "translateY(-4px) scale(1.03)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 24px #6366f122, 0 1.5px 0 #fde68a55";
                e.currentTarget.style.transform = "none";
              }}
            >
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/210x300?text=No+Image"
                }
                alt={movie.Title}
                style={{
                  width: 160,
                  height: 230,
                  objectFit: "cover",
                  borderRadius: 14,
                  marginBottom: 16,
                  border: "2.5px solid #a5b4fc55",
                  boxShadow: "0 2px 12px #6366f122",
                  background: "#f1f5f9",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.border = "2.5px solid #fde68a";
                  e.currentTarget.style.boxShadow = "0 4px 24px #fde68a55";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.border = "2.5px solid #a5b4fc55";
                  e.currentTarget.style.boxShadow = "0 2px 12px #6366f122";
                }}
              />
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  textAlign: "center",
                  marginBottom: 8,
                  color: "#1e293b",
                  letterSpacing: 0.5,
                  textShadow: "0 1px 0 #fff, 0 2px 8px #a5b4fc33",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
                title={movie.Title}
              >
                {movie.Title}
              </div>
              <div style={{ color: "#6366f1", fontSize: 16, fontWeight: 600 }}>
                {movie.Year}
              </div>
              {/* IMDB Rating (decorative) */}
              {movie.imdbRating && (
                <div
                  style={{
                    color: "#fde68a",
                    background: "#6366f1",
                    fontWeight: 700,
                    fontSize: 15,
                    borderRadius: 8,
                    padding: "2px 12px",
                    marginTop: 8,
                    marginBottom: 2,
                    boxShadow: "0 1px 4px #6366f122",
                    letterSpacing: 1,
                    display: "inline-block",
                  }}
                >
                  ⭐ IMDB: {movie.imdbRating}
                </div>
              )}
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 18,
                  background: "#fde68a",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 8,
                  padding: "2px 10px",
                  boxShadow: "0 1px 4px #fde68a55",
                  letterSpacing: 1,
                }}
              >
                {movie.Type?.toUpperCase() || "MOVIE"}
              </span>
            </div>
          ))}
        </div>
        {!loading && !error && movies.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#a5b4fc",
              marginTop: 48,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Start searching for movies above!
          </div>
        )}
      </div>
      <footer
        style={{
          textAlign: "center",
          color: "#6366f1",
          fontSize: 16,
          margin: "48px 0 16px 0",
          fontWeight: 600,
          letterSpacing: 1,
          textShadow: "0 1px 0 #fff, 0 2px 8px #a5b4fc33",
        }}
      >
        &copy; {new Date().getFullYear()} Movie Search App &mdash; Powered by
        OMDB API
      </footer>
    </div>
  );
}

export default App;
