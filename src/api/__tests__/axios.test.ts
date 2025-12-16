import { API } from '../axios';
import { HTTP_STATUS_MESSAGES } from '../../constants';

describe('Axios API Configuration', () => {
  it('should create axios instance with correct base URL', () => {
    expect(API.defaults.baseURL).toBe('https://api.restful-api.dev');
  });

  it('should have correct timeout configuration', () => {
    expect(API.defaults.timeout).toBe(15000);
  });

  it('should have correct headers', () => {
    expect(API.defaults.headers['Content-Type']).toBe('application/json');
  });

  describe('Response Interceptor - Success', () => {
    it('should return successful response as-is', () => {
      const mockResponse = { data: { id: '1', name: 'Test' }, status: 200, config: {} };
      const successHandler = API.interceptors.response.handlers[0].fulfilled;
      const result = successHandler(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Response Interceptor - Error Handling', () => {
    it('should handle error with response status and server message', () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toBe('Not found');
      });
    });

    it('should handle error with HTTP status message', () => {
      const mockError = {
        response: {
          status: 500,
          data: {},
        },
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toBe(HTTP_STATUS_MESSAGES[500]);
      });
    });

    it('should handle error with no response (network error)', () => {
      const mockError = {
        request: {},
        message: 'Network Error',
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toBe('No response received. Check your internet connection.');
      });
    });

    it('should handle error in request setup', () => {
      const mockError = {
        message: 'Request setup error',
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toBe('Request setup error');
      });
    });

    it('should handle unknown error', () => {
      const mockError = {
        message: undefined,
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toBe('An error occurred while setting up the request.');
      });
    });

    it('should handle error with status code not in HTTP_STATUS_MESSAGES', () => {
      const mockError = {
        response: {
          status: 418,
          data: {},
        },
      };

      const errorHandler = API.interceptors.response.handlers[0].rejected;
      return errorHandler(mockError).catch((error: Error) => {
        expect(error.message).toContain('418');
      });
    });
  });
});

