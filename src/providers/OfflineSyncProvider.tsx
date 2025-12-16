import React, { useEffect, useState, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../shared/hooks/useAppDispatch';
import { setInitialOfflineData } from '../features/objects/objectsSlice';
import { syncOfflineQueueAsync } from '../features/objects/objectsThunks';
import { ObjectFormInput, ObjectData } from '../features/objects/objectsTypes';
import { ASYNC_STORAGE_KEYS } from '../constants';

interface OfflineSyncProviderProps {
  children: React.ReactNode;
}

const OfflineSyncProvider: React.FC<OfflineSyncProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const wasOfflineRef = useRef<boolean | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const offlineQueueJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
        const lastFetchedJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_FETCHED_OBJECTS);

        const offlineQueue: ObjectFormInput[] = offlineQueueJson ? JSON.parse(offlineQueueJson) : [];
        const lastFetched: ObjectData[] = lastFetchedJson ? JSON.parse(lastFetchedJson) : [];

        dispatch(setInitialOfflineData({ offlineQueue, lastFetched }));

        const netStatus = await NetInfo.fetch();
        const isOnline = netStatus.isConnected === true;
        wasOfflineRef.current = !isOnline;

        if (isOnline && offlineQueue.length > 0) {
          dispatch(syncOfflineQueueAsync());
        }
      } catch (e) {
      } finally {
        setIsReady(true);
      }
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isOnline = state.isConnected === true;
      const wasOffline = wasOfflineRef.current;
      
      if (isOnline && wasOffline === true) {
        const offlineQueueJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
        const offlineQueue: ObjectFormInput[] = offlineQueueJson ? JSON.parse(offlineQueueJson) : [];
        
        if (offlineQueue.length > 0) {
          dispatch(syncOfflineQueueAsync());
        }
      }
      
      wasOfflineRef.current = !isOnline;
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};

export default OfflineSyncProvider;

