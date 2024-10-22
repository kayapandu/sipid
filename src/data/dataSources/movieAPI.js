import ApiService from '../../services/api';

const apiClient = new ApiService({});

const MovieAPI = {
  fetchMovie: async () => {
    try {
      const response = await apiClient.get('/discover/movie');
      return response;
    } catch (error) {
      console.log('xxx', error);
    }
  },
};


export default MovieAPI;
