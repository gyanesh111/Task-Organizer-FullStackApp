import axios from "axios";

// Create a common api for all the apis
const baseUrl = process.env.REACT_APP_BACKEND_URL;
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

// If there is a jwt token then attach it to the header of the request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;