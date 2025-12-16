import { ObjectApi, ObjectApiPayload, ObjectData } from '../objects';
import { API } from '../axios';

jest.mock('../axios');

const mockAPI = API as jest.Mocked<typeof API>;

describe('ObjectApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create object successfully', async () => {
      const payload: ObjectApiPayload = {
        name: 'Test Device',
        data: {
          year: 2024,
          price: 1200,
          'CPU model': 'M2',
          'Hard disk size': '512GB',
        },
      };

      const mockResponse: ObjectData = {
        id: '123',
        ...payload,
      };

      mockAPI.post.mockResolvedValue({ data: mockResponse } as any);

      const result = await ObjectApi.create(payload);

      expect(mockAPI.post).toHaveBeenCalledWith('/objects', payload);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      const payload: ObjectApiPayload = {
        name: 'Test Device',
        data: {
          year: 2024,
          price: 1200,
          'CPU model': 'M2',
          'Hard disk size': '512GB',
        },
      };

      mockAPI.post.mockRejectedValue(new Error('API Error'));

      await expect(ObjectApi.create(payload)).rejects.toThrow('API Error');
    });
  });

  describe('fetchByIds', () => {
    it('should fetch objects by IDs successfully', async () => {
      const query = 'id=1&id=2';
      const mockResponse: ObjectData[] = [
        {
          id: '1',
          name: 'Device 1',
          data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
        },
        {
          id: '2',
          name: 'Device 2',
          data: { year: 2023, price: 200, 'CPU model': 'X2', 'Hard disk size': '512GB' },
        },
      ];

      mockAPI.get.mockResolvedValue({ data: mockResponse } as any);

      const result = await ObjectApi.fetchByIds(query);

      expect(mockAPI.get).toHaveBeenCalledWith(`/objects?${query}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      const query = 'id=1';
      mockAPI.get.mockRejectedValue(new Error('Network Error'));

      await expect(ObjectApi.fetchByIds(query)).rejects.toThrow('Network Error');
    });
  });
});

