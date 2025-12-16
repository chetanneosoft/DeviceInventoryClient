import axios, { AxiosError } from 'axios';
import { API_BASE_URL, HTTP_STATUS_MESSAGES } from '../constants';

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    let userMessage = 'An unknown network error occurred.';

    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = (error.response.data as any)?.message || (error.response.data as any)?.error;
      userMessage = serverMessage || HTTP_STATUS_MESSAGES[statusCode] || `Request failed with status: ${statusCode}`;
    } else if (error.request) {
      userMessage = 'No response received. Check your internet connection.';
    } else {
      userMessage = error.message || 'An error occurred while setting up the request.';
    }

    return Promise.reject(new Error(userMessage));
  }
);

