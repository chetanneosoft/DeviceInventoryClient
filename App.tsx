import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppDispatch } from './src/shared/hooks/useAppDispatch';
import { setInitialOfflineData } from './src/features/objects/objectsSlice';
import { ObjectFormInput, ObjectData } from './src/features/objects/objectsTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from './src/constants';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const offlineQueueJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
        const lastFetchedJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_FETCHED_OBJECTS);

        const offlineQueue: ObjectFormInput[] = offlineQueueJson ? JSON.parse(offlineQueueJson) : [];
        const lastFetched: ObjectData[] = lastFetchedJson ? JSON.parse(lastFetchedJson) : [];

        dispatch(setInitialOfflineData({ offlineQueue, lastFetched }));
      } catch (e) {
        console.error('Failed to load initial AsyncStorage data', e);
      } finally {
        setIsReady(true);
      }
    };

    loadInitialData();
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
