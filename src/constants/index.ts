export const API_BASE_URL = 'https://api.restful-api.dev';

export const ASYNC_STORAGE_KEYS = {
  OFFLINE_OBJECTS: '@RestfulApiApp:offlineObjects',
  LAST_FETCHED_OBJECTS: '@RestfulApiApp:lastFetchedObjects',
  OFFLINE_OBJECTS_WITH_IDS: '@RestfulApiApp:offlineObjectsWithIds',
} as const;

export const HTTP_STATUS_MESSAGES: { [key: number]: string } = {
  400: 'Bad Request. Check your input.',
  401: 'Unauthorized. Please check your credentials.',
  403: 'Forbidden. You do not have permission.',
  404: 'Resource not found.',
  500: 'Server error. Please try again later.',
  502: 'Bad Gateway. Server is temporarily unavailable.',
  503: 'Service Unavailable. Please try again later.',
} as const;

