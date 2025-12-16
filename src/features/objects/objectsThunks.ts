import { createAsyncThunk } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectApi } from '../../api/objects';
import { ObjectFormInput, ObjectData } from './objectsTypes';
import { ASYNC_STORAGE_KEYS } from '../../constants';
import { parseIdsToQuery } from '../../utils/validation';
import { RootState } from '../../store/store';
import { strings } from '../../constants/strings';

const generateOfflineId = async (): Promise<string> => {
  try {
    const offlineObjectsWithIdsJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS);
    const offlineObjectsWithIds: ObjectData[] = offlineObjectsWithIdsJson ? JSON.parse(offlineObjectsWithIdsJson) : [];
    const nextId = offlineObjectsWithIds.length + 1;
    return `offline-${nextId}`;
  } catch (error) {
    return 'offline-1';
  }
};

export const createObjectAsync = createAsyncThunk(
  'objects/createObject',
  async (formData: ObjectFormInput, { rejectWithValue }) => {
    const netStatus = await NetInfo.fetch();

    if (!netStatus.isConnected) {
      try {
        const existingQueueJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
        const existingQueue: ObjectFormInput[] = existingQueueJson ? JSON.parse(existingQueueJson) : [];
        existingQueue.push(formData);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS, JSON.stringify(existingQueue));

        const offlineId = await generateOfflineId();
        const offlineObjectWithId: ObjectData = {
          id: offlineId,
          name: formData.name,
          data: {
            ...formData.data,
            year: Number(formData.data.year),
            price: Number(formData.data.price),
          },
        };

        const offlineObjectsWithIdsJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS);
        const offlineObjectsWithIds: ObjectData[] = offlineObjectsWithIdsJson ? JSON.parse(offlineObjectsWithIdsJson) : [];
        offlineObjectsWithIds.push(offlineObjectWithId);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS, JSON.stringify(offlineObjectsWithIds));

        return { isOffline: true, data: formData, tempId: offlineId, message: strings.messages.error.dataSavedLocallyMessage };
      } catch (storageError) {
        return rejectWithValue(strings.messages.error.failedToSave);
      }
    }

    try {
      const apiPayload = {
        name: formData.name,
        data: {
          ...formData.data,
          year: Number(formData.data.year),
          price: Number(formData.data.price),
        },
      };

      const newObject = await ObjectApi.create(apiPayload);
      return newObject;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchObjectsByIdsAsync = createAsyncThunk(
  'objects/fetchObjectsByIds',
  async (idsInput: string, { rejectWithValue, getState }) => {
    const netStatus = await NetInfo.fetch();
    const state = getState() as RootState;

    const ids = idsInput.split(',').map(id => id.trim()).filter(id => id);
    const offlineIds = ids.filter(id => id.startsWith('offline-'));
    const apiIds = ids.filter(id => !id.startsWith('offline-'));

    let offlineObjects: ObjectData[] = [];
    if (offlineIds.length > 0) {
      try {
        const offlineObjectsWithIdsJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS);
        const allOfflineObjects: ObjectData[] = offlineObjectsWithIdsJson ? JSON.parse(offlineObjectsWithIdsJson) : [];
        offlineObjects = allOfflineObjects.filter(obj => obj.id && offlineIds.includes(obj.id));
      } catch (error) {
      }
    }

    if (!netStatus.isConnected) {
      if (offlineIds.length > 0 && apiIds.length === 0) {
        return offlineObjects.length > 0 ? offlineObjects : {
          isOffline: true,
          data: state.objects.lastFetched,
          message: strings.messages.error.offlineDisplay,
        };
      }
      return {
        isOffline: true,
        data: offlineObjects.length > 0 ? offlineObjects : state.objects.lastFetched,
        message: strings.messages.error.offlineDisplay,
      };
    }

    let apiObjects: ObjectData[] = [];
    if (apiIds.length > 0) {
      try {
        const queryString = apiIds.map(id => `id=${id}`).join('&');
        apiObjects = await ObjectApi.fetchByIds(queryString);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LAST_FETCHED_OBJECTS, JSON.stringify(apiObjects));
      } catch (error: any) {
        if (offlineObjects.length > 0) {
          return offlineObjects;
        }
        return rejectWithValue(error.message);
      }
    }

    const allObjects = [...offlineObjects, ...apiObjects];
    return allObjects.length > 0 ? allObjects : rejectWithValue(strings.messages.error.noObjectsFound);
  }
);

export const syncOfflineQueueAsync = createAsyncThunk(
  'objects/syncOfflineQueue',
  async (_, { rejectWithValue }) => {
      try {
        const offlineQueueJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
        const offlineQueue: ObjectFormInput[] = offlineQueueJson ? JSON.parse(offlineQueueJson) : [];

        const offlineObjectsWithIdsJson = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS);
        const offlineObjectsWithIds: ObjectData[] = offlineObjectsWithIdsJson ? JSON.parse(offlineObjectsWithIdsJson) : [];

        if (offlineQueue.length === 0) {
          return { synced: 0, failed: 0 };
        }

        const netStatus = await NetInfo.fetch();
        if (!netStatus.isConnected) {
          return rejectWithValue(strings.messages.error.deviceOffline);
        }

        let synced = 0;
        let failed = 0;
        const failedItems: ObjectFormInput[] = [];
        const failedObjectsWithIds: ObjectData[] = [];
        const idMapping: { [tempId: string]: string } = {};

        for (let i = 0; i < offlineQueue.length; i++) {
          const formData = offlineQueue[i];
          const offlineObject = offlineObjectsWithIds[i];
          const tempId = offlineObject?.id;

          try {
            const apiPayload = {
              name: formData.name,
              data: {
                ...formData.data,
                year: Number(formData.data.year),
                price: Number(formData.data.price),
              },
            };

            const createdObject = await ObjectApi.create(apiPayload);
            
            if (tempId && createdObject.id) {
              idMapping[tempId] = createdObject.id;
            }
            
            synced++;
          } catch (error: any) {
            failed++;
            failedItems.push(formData);
            if (offlineObject) {
              failedObjectsWithIds.push(offlineObject);
            }
          }
        }

        if (failedItems.length > 0) {
          await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS, JSON.stringify(failedItems));
          await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS, JSON.stringify(failedObjectsWithIds));
        } else {
          await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS);
          await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.OFFLINE_OBJECTS_WITH_IDS);
        }

        return { synced, failed, remaining: failedItems.length, remainingItems: failedItems, idMapping };
    } catch (error: any) {
      return rejectWithValue(error.message || strings.messages.error.syncFailed);
    }
  }
);