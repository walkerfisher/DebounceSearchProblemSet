import React, { useState, useEffect } from "react";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
};

type ApiResponse = {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
};

const DebouncedSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  const API_KEY = "8a1b9c53";

  function handleQuery(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setError(null);
      setResults([]);
      return;
    }

    fetchMovies();
  }, [debouncedQuery]);

  async function fetchMovies() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${debouncedQuery}`
      );

      const data: ApiResponse = await response.json();

      if (data.Response === "True") {
        setResults(data.Search);
      } else {
        setError(data.Error || "Failed to fetch data.");
      }
    } catch (e) {
      setError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="debounced-search">
      <label htmlFor="search-input">Search for a movie:</label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={handleQuery}
        placeholder="Type to search..."
      />

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {results.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <span>
              {movie.Title} ({movie.Year})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebouncedSearch;
