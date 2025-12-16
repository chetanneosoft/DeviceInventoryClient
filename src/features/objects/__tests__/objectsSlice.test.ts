import objectsReducer, {
  clearObjectsError,
  setInitialOfflineData,
} from '../objectsSlice';
import { createObjectAsync, fetchObjectsByIdsAsync } from '../objectsThunks';
import { ObjectData, ObjectFormInput, ObjectsState } from '../objectsTypes';

describe('objectsSlice', () => {
  const initialState: ObjectsState = {
    objects: [],
    offlineQueue: [],
    isLoading: false,
    error: null,
    lastFetched: [],
  };

  it('should return initial state', () => {
    expect(objectsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearObjectsError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error',
    };

    const result = objectsReducer(stateWithError, clearObjectsError());
    expect(result.error).toBeNull();
  });

  it('should handle setInitialOfflineData', () => {
    const offlineQueue: ObjectFormInput[] = [
      {
        name: 'Test',
        data: { year: '2024', price: '100', 'CPU model': 'X1', 'Hard disk size': '256GB' },
      },
    ];

    const lastFetched: ObjectData[] = [
      {
        id: '1',
        name: 'Test Device',
        data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
      },
    ];

    const result = objectsReducer(
      initialState,
      setInitialOfflineData({ offlineQueue, lastFetched })
    );

    expect(result.offlineQueue).toEqual(offlineQueue);
    expect(result.lastFetched).toEqual(lastFetched);
  });

  it('should handle createObjectAsync.pending', () => {
    const action = { type: createObjectAsync.pending.type };
    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle createObjectAsync.fulfilled with online success', () => {
    const newObject: ObjectData = {
      id: '123',
      name: 'Test Device',
      data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
    };

    const action = {
      type: createObjectAsync.fulfilled.type,
      payload: newObject,
    };

    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.objects).toHaveLength(1);
    expect(result.objects[0]).toEqual(newObject);
    expect(result.error).toContain('successfully created');
  });

  it('should handle createObjectAsync.fulfilled with offline save', () => {
    const formData: ObjectFormInput = {
      name: 'Test',
      data: { year: '2024', price: '100', 'CPU model': 'X1', 'Hard disk size': '256GB' },
    };

    const action = {
      type: createObjectAsync.fulfilled.type,
      payload: { isOffline: true, data: formData, message: 'Saved locally' },
    };

    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.offlineQueue).toHaveLength(1);
    expect(result.offlineQueue[0]).toEqual(formData);
    expect(result.error).toContain('saved locally');
  });

  it('should handle createObjectAsync.rejected', () => {
    const action = {
      type: createObjectAsync.rejected.type,
      payload: 'Network error',
    };

    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should handle fetchObjectsByIdsAsync.pending', () => {
    const action = { type: fetchObjectsByIdsAsync.pending.type };
    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle fetchObjectsByIdsAsync.fulfilled with online success', () => {
    const fetchedObjects: ObjectData[] = [
      {
        id: '1',
        name: 'Device 1',
        data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
      },
    ];

    const action = {
      type: fetchObjectsByIdsAsync.fulfilled.type,
      payload: fetchedObjects,
    };

    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.lastFetched).toEqual(fetchedObjects);
    expect(result.error).toBe('Objects fetched successfully.');
  });

  it('should handle fetchObjectsByIdsAsync.fulfilled with offline fallback', () => {
    const lastFetched: ObjectData[] = [
      {
        id: '1',
        name: 'Device 1',
        data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
      },
    ];

    const stateWithLastFetched = {
      ...initialState,
      lastFetched,
    };

    const action = {
      type: fetchObjectsByIdsAsync.fulfilled.type,
      payload: { isOffline: true, data: lastFetched, message: 'Offline mode' },
    };

    const result = objectsReducer(stateWithLastFetched, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Offline mode');
  });

  it('should handle fetchObjectsByIdsAsync.rejected', () => {
    const action = {
      type: fetchObjectsByIdsAsync.rejected.type,
      payload: 'API error',
    };

    const result = objectsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('API error');
  });
});

