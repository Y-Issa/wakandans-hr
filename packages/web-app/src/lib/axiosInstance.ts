import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { clearCookie } from './cookieUtils';
import useStore from './store';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const clearUser = useStore;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearCookie('loggedIn');
      clearCookie('session');
      clearUser();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
