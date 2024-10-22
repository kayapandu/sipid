import axios from 'axios';
import { API_ROOT, TIMEOUT, API_READ } from '../constants/config';

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_READ}`,
};

class ApiService {
  constructor({ baseURL = API_ROOT, timeout = TIMEOUT, headers = HEADERS }) {
    const client = axios.create({
      baseURL,
      timeout,
      headers,
    });

    client.interceptors.response.use(this.handleSuccess, this.handleError);
    this.client = client;
  }

  setConfig(config) {
    this.client.interceptors.request.use(config);
  }

  handleSuccess(response) {
    return Promise.resolve(response);
  }

  handleError(error) {
    return Promise.reject(error);
  }

  get(path, option) {
    return this.client.get(path, option).then(response => response.data);
  }

  post(path, payload) {
    return this.client.post(path, payload).then(response => response.data);
  }

  put(path, payload) {
    return this.client.put(path, payload).then(response => response.data);
  }

  patch(path, payload) {
    return this.client.patch(path, payload).then(response => response.data);
  }

  delete(path) {
    return this.client.delete(path).then(response => response.data);
  }
}

export default ApiService;
