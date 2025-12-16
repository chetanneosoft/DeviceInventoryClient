export interface ObjectData {
  id?: string;
  name: string;
  data: {
    [key: string]: any;
  } | null;
}

export interface ObjectFormInput {
  name: string;
  data: {
    year: string;
    price: string;
    'CPU model': string;
    'Hard disk size': string;
  };
}

export interface ObjectsState {
  objects: ObjectData[];
  offlineQueue: ObjectFormInput[];
  isLoading: boolean;
  error: string | null;
  lastFetched: ObjectData[];
}

