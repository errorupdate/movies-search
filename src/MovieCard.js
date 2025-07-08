import React from "react";
import "./MovieCard.css"; // Import the CSS file for styling

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/210x300?text=No+Image"
        }
        alt={movie.Title}
        className="movie-card-img"
      />
      <div className="movie-card-title" title={movie.Title}>
        {movie.Title}
      </div>
      <div className="movie-card-year">{movie.Year}</div>
      {movie.imdbRating && (
        <div className="movie-card-rating">⭐ IMDB: {movie.imdbRating}</div>
      )}
      <span className="movie-card-type">
        {movie.Type?.toUpperCase() || "MOVIE"}
      </span>
    </div>
  );
}

export default MovieCard;
