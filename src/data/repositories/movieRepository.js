import MovieAPI from '../dataSources/movieAPI';

const MovieRepository = {
  getMovie: () => {
    return MovieAPI.fetchMovie();
  },
};

export default MovieRepository;
