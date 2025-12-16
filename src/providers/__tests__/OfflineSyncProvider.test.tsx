import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineSyncProvider from '../OfflineSyncProvider';
import objectsReducer from '../../features/objects/objectsSlice';

jest.mock('@react-native-community/netinfo');
jest.mock('@react-native-async-storage/async-storage');

const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('OfflineSyncProvider', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        objects: objectsReducer,
      },
    });

    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);
    mockNetInfo.addEventListener.mockReturnValue(() => {});
  });

  it('should render children when ready', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test Child</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Test Child')).toBeTruthy();
    });
  });

  it('should load initial offline data', async () => {
    const offlineQueue = [{ name: 'Test', data: { year: '2024', price: '100', 'CPU model': 'X1', 'Hard disk size': '256GB' } }];
    const lastFetched = [{ id: '1', name: 'Device', data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' } }];

    mockAsyncStorage.getItem
      .mockResolvedValueOnce(JSON.stringify(offlineQueue))
      .mockResolvedValueOnce(JSON.stringify(lastFetched));

    render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockAsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should load and sync initial offline queue when online', async () => {
    const offlineQueue = [{ name: 'Test', data: { year: '2024', price: '100', 'CPU model': 'X1', 'Hard disk size': '256GB' } }];

    mockAsyncStorage.getItem
      .mockResolvedValueOnce(JSON.stringify(offlineQueue))
      .mockResolvedValueOnce(null);
    
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

    render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNetInfo.fetch).toHaveBeenCalled();
    });
  });

  it('should not sync when already online and no queue', async () => {
    mockAsyncStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

    render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNetInfo.fetch).toHaveBeenCalled();
    });
  });

  it('should handle network status change from offline to online', async () => {
    const offlineQueue = [{ name: 'Test', data: { year: '2024', price: '100', 'CPU model': 'X1', 'Hard disk size': '256GB' } }];

    mockAsyncStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(offlineQueue));
    
    mockNetInfo.fetch.mockResolvedValue({ isConnected: false } as any);

    let networkCallback: any;
    mockNetInfo.addEventListener.mockImplementation((callback: any) => {
      networkCallback = callback;
      return () => {};
    });

    render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNetInfo.fetch).toHaveBeenCalled();
    });

    if (networkCallback) {
      networkCallback({ isConnected: true });
    }

    await waitFor(() => {
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(3);
    });
  });

  it('should handle network status change when already online', async () => {
    mockAsyncStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

    let networkCallback: any;
    mockNetInfo.addEventListener.mockImplementation((callback: any) => {
      networkCallback = callback;
      return () => {};
    });

    render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNetInfo.fetch).toHaveBeenCalled();
    });

    if (networkCallback) {
      networkCallback({ isConnected: true });
    }

    await waitFor(() => {
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle error during initial data load', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true } as any);

    const { getByText } = render(
      <Provider store={store}>
        <OfflineSyncProvider>
          <View><Text>Test</Text></View>
        </OfflineSyncProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Test')).toBeTruthy();
    });
  });
});

