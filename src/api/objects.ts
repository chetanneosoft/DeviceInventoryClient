import { API } from './axios';

export interface ObjectData {
  id?: string;
  name: string;
  data: {
    year: number;
    price: number;
    'CPU model': string;
    'Hard disk size': string;
    [key: string]: any;
  };
}

export interface ObjectApiPayload {
  name: string;
  data: {
    year: number;
    price: number;
    'CPU model': string;
    'Hard disk size': string;
  };
}

export const ObjectApi = {
  create: async (payload: ObjectApiPayload): Promise<ObjectData> => {
    try {
      const response = await API.post<ObjectData>('/objects', payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  fetchByIds: async (query: string): Promise<ObjectData[]> => {
    try {
      const response = await API.get<ObjectData[]>(`/objects?${query}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

