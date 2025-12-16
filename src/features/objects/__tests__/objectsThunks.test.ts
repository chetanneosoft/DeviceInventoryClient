import { configureStore } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createObjectAsync, fetchObjectsByIdsAsync } from '../objectsThunks';
import objectsReducer from '../objectsSlice';
import { ObjectApi } from '../../../api/objects';
import { ObjectFormInput, ObjectData } from '../objectsTypes';

jest.mock('../../../api/objects');
jest.mock('@react-native-community/netinfo');
jest.mock('@react-native-async-storage/async-storage');

const mockObjectApi = ObjectApi as jest.Mocked<typeof ObjectApi>;
const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('objectsThunks', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        objects: objectsReducer,
      },
    });

    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  describe('createObjectAsync', () => {
    const mockFormData: ObjectFormInput = {
      name: 'Test Device',
      data: {
        year: '2024',
        price: '1200',
        'CPU model': 'M2',
        'Hard disk size': '512GB',
      },
    };

    it('should create object successfully when online', async () => {
      const mockResponse: ObjectData = {
        id: '123',
        name: 'Test Device',
        data: { year: 2024, price: 1200, 'CPU model': 'M2', 'Hard disk size': '512GB' },
      };

      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockObjectApi.create.mockResolvedValue(mockResponse);

      const result = await store.dispatch(createObjectAsync(mockFormData));

      expect(mockObjectApi.create).toHaveBeenCalledWith({
        name: 'Test Device',
        data: {
          year: 2024,
          price: 1200,
          'CPU model': 'M2',
          'Hard disk size': '512GB',
        },
      });

      expect(result.type).toBe('objects/createObject/fulfilled');
      expect((result.payload as ObjectData).id).toBe('123');
    });

    it('should save to AsyncStorage when offline', async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: false } as any);

      const result = await store.dispatch(createObjectAsync(mockFormData));

      expect(mockObjectApi.create).not.toHaveBeenCalled();
      expect(mockAsyncStorage.getItem).toHaveBeenCalled();
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();

      expect(result.type).toBe('objects/createObject/fulfilled');
      expect((result.payload as any).isOffline).toBe(true);
    });

    it('should handle API error', async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockObjectApi.create.mockRejectedValue(new Error('API Error'));

      const result = await store.dispatch(createObjectAsync(mockFormData));

      expect(result.type).toBe('objects/createObject/rejected');
      expect(result.payload).toBe('API Error');
    });
  });

  describe('fetchObjectsByIdsAsync', () => {
    it('should fetch objects successfully when online', async () => {
      const mockResponse: ObjectData[] = [
        {
          id: '1',
          name: 'Device 1',
          data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
        },
      ];

      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockObjectApi.fetchByIds.mockResolvedValue(mockResponse);

      const result = await store.dispatch(fetchObjectsByIdsAsync('1,2'));

      expect(mockObjectApi.fetchByIds).toHaveBeenCalledWith('id=1&id=2');
      expect(result.type).toBe('objects/fetchObjectsByIds/fulfilled');
      expect((result.payload as ObjectData[]).length).toBe(1);
    });

    it('should return last fetched when offline', async () => {
      const lastFetched: ObjectData[] = [
        {
          id: '1',
          name: 'Device 1',
          data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
        },
      ];

      store = configureStore({
        reducer: {
          objects: objectsReducer,
        },
        preloadedState: {
          objects: {
            objects: [],
            offlineQueue: [],
            isLoading: false,
            error: null,
            lastFetched,
          },
        },
      });

      mockNetInfo.fetch.mockResolvedValue({ isConnected: false } as any);

      const result = await store.dispatch(fetchObjectsByIdsAsync('1'));

      expect(mockObjectApi.fetchByIds).not.toHaveBeenCalled();
      expect(result.type).toBe('objects/fetchObjectsByIds/fulfilled');
      expect((result.payload as any).isOffline).toBe(true);
    });

    it('should handle invalid ID format', async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

      const result = await store.dispatch(fetchObjectsByIdsAsync('abc,def'));

      expect(result.type).toBe('objects/fetchObjectsByIds/rejected');
      expect(result.payload).toContain('Invalid ID format');
    });

    it('should handle API error', async () => {
      mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
      mockObjectApi.fetchByIds.mockRejectedValue(new Error('Network Error'));

      const result = await store.dispatch(fetchObjectsByIdsAsync('1'));

      expect(result.type).toBe('objects/fetchObjectsByIds/rejected');
      expect(result.payload).toBe('Network Error');
    });
  });
});

