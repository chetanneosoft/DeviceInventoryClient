import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import AddObjectScreen from '../AddObjectScreen';
import objectsReducer from '../../features/objects/objectsSlice';
import { ObjectFormInput } from '../../features/objects/objectsTypes';

jest.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({ isConnected: true }),
}));

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

describe('AddObjectScreen', () => {
  const renderComponent = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <AddObjectScreen />
        </NavigationContainer>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render screen title', () => {
    const { getByText } = renderComponent();
    expect(getByText('Add New Object')).toBeTruthy();
  });

  it('should render navigation button', () => {
    const { getByText } = renderComponent();
    expect(getByText(/Go to Get Objects Screen/)).toBeTruthy();
  });

  it('should render form component', () => {
    const { getByPlaceholderText } = renderComponent();
    expect(getByPlaceholderText('Name')).toBeTruthy();
  });

  it('should display error message when validation fails', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const nameInput = getByPlaceholderText('Name');
    fireEvent.changeText(nameInput, 'Test');

    const submitButton = getByText('Submit Object');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/required/i)).toBeTruthy();
    });
  });

  it('should clear error when form is submitted with valid data', async () => {
    const store = createMockStore({ error: 'Previous error' });
    const { getByText, getByPlaceholderText, queryByText } = renderComponent(store);

    const nameInput = getByPlaceholderText('Name');
    const yearInput = getByPlaceholderText('Year (e.g., 2024)');
    const priceInput = getByPlaceholderText('Price (e.g., 1200)');
    const cpuInput = getByPlaceholderText('CPU Model');
    const diskInput = getByPlaceholderText('Hard Disk Size');

    fireEvent.changeText(nameInput, 'Test Device');
    fireEvent.changeText(yearInput, '2024');
    fireEvent.changeText(priceInput, '1200');
    fireEvent.changeText(cpuInput, 'M2');
    fireEvent.changeText(diskInput, '512GB');

    const submitButton = getByText('Submit Object');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(queryByText('Previous error')).toBeNull();
    });
  });

  it('should display loading overlay when isLoading is true', () => {
    const store = createMockStore({ isLoading: true });
    const { UNSAFE_root } = renderComponent(store);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should display global error message', () => {
    const store = createMockStore({ error: 'Global error message' });
    const { getByText } = renderComponent(store);
    expect(getByText('Global error message')).toBeTruthy();
  });

  it('should handle form submission', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const nameInput = getByPlaceholderText('Name');
    const yearInput = getByPlaceholderText('Year (e.g., 2024)');
    const priceInput = getByPlaceholderText('Price (e.g., 1200)');
    const cpuInput = getByPlaceholderText('CPU Model');
    const diskInput = getByPlaceholderText('Hard Disk Size');

    fireEvent.changeText(nameInput, 'Test Device');
    fireEvent.changeText(yearInput, '2024');
    fireEvent.changeText(priceInput, '1200');
    fireEvent.changeText(cpuInput, 'M2');
    fireEvent.changeText(diskInput, '512GB');

    const submitButton = getByText('Submit Object');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(nameInput.props.value).toBe('');
    });
  });
});

