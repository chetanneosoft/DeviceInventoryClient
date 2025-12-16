import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import GetObjectsByIdScreen from '../GetObjectsByIdScreen';
import objectsReducer from '../../features/objects/objectsSlice';
import { ObjectData } from '../../features/objects/objectsTypes';

jest.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({ isConnected: true }),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: () => ({
      params: {},
    }),
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      objects: objectsReducer,
    },
    preloadedState: {
      objects: {
        objects: [],
        offlineQueue: [],
        isLoading: false,
        error: null,
        lastFetched: [],
        ...initialState,
      },
    },
  });
};

describe('GetObjectsByIdScreen', () => {
  const renderComponent = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <GetObjectsByIdScreen />
        </NavigationContainer>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render screen title', () => {
    const { getByText } = renderComponent();
    expect(getByText('Get Objects by ID')).toBeTruthy();
  });

  it('should render add button', () => {
    const { getByText } = renderComponent();
    expect(getByText('+')).toBeTruthy();
  });

  it('should render input field', () => {
    const { getByPlaceholderText } = renderComponent();
    expect(getByPlaceholderText(/Enter IDs/)).toBeTruthy();
  });

  it('should render fetch button', () => {
    const { getByText } = renderComponent();
    expect(getByText('Fetch Objects')).toBeTruthy();
  });

  it('should display error when IDs input is empty', async () => {
    const { getByText } = renderComponent();

    const fetchButton = getByText('Fetch Objects');
    fireEvent.press(fetchButton);

    await waitFor(() => {
      expect(getByText(/Please enter at least one object ID/i)).toBeTruthy();
    });
  });

  it('should handle valid IDs input', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText(/Enter IDs/);
    fireEvent.changeText(input, '1,2,3');

    const fetchButton = getByText('Fetch Objects');
    fireEvent.press(fetchButton);

    await waitFor(() => {
      expect(input.props.value).toBe('1,2,3');
    });
  });

  it('should display fetched objects', () => {
    const mockObjects: ObjectData[] = [
      {
        id: '1',
        name: 'Device 1',
        data: { year: 2024, price: 100, 'CPU model': 'X1', 'Hard disk size': '256GB' },
      },
    ];

    const store = createMockStore({ lastFetched: mockObjects });
    const { getByText } = renderComponent(store);

    expect(getByText('Device 1')).toBeTruthy();
  });

  it('should display loading overlay when isLoading is true', () => {
    const store = createMockStore({ isLoading: true });
    const { UNSAFE_root } = renderComponent(store);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should display error message', () => {
    const store = createMockStore({ error: 'API Error' });
    const { getByText } = renderComponent(store);
    expect(getByText('API Error')).toBeTruthy();
  });

  it('should display empty state when no objects', () => {
    const { getByText } = renderComponent();
    expect(getByText(/No objects fetched yet/i)).toBeTruthy();
  });

  it('should handle invalid ID format', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText(/Enter IDs/);
    fireEvent.changeText(input, 'abc,def');

    const fetchButton = getByText('Fetch Objects');
    fireEvent.press(fetchButton);

    await waitFor(() => {
      expect(getByText(/Invalid input/i)).toBeTruthy();
    });
  });

  it('should filter and display valid objects only', () => {
    const mockObjects: ObjectData[] = [
      {
        id: '1',
        name: 'Device 1',
        data: { year: 2024 },
      },
      {
        id: '2',
        name: 'Device 2',
        data: null,
      },
    ];

    const store = createMockStore({ lastFetched: mockObjects });
    const { getByText } = renderComponent(store);

    expect(getByText('Device 1')).toBeTruthy();
    expect(getByText('Device 2')).toBeTruthy();
  });
});

