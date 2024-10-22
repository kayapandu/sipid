import MovieRepository from '../../data/repositories/movieRepository';
import Movie from '../models/movie';

const fetchMovies = async () => {
  const movies = await MovieRepository.getMovie();
  return movies;
};

export default fetchMovies;
