import React, { createContext, useState, useEffect } from 'react';
import fetchMovies from '../../domain/useCases/fetchMovie';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      setLoading(false);
    } catch (err) {
      console.log(err)
    }

  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading }}>
      {children}
    </MovieContext.Provider>
  );
};
