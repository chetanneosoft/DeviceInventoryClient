import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectsState, ObjectData, ObjectFormInput } from './objectsTypes';
import { createObjectAsync, fetchObjectsByIdsAsync, syncOfflineQueueAsync } from './objectsThunks';
import { strings, formatString } from '../../constants/strings';

const initialState: ObjectsState = {
  objects: [],
  offlineQueue: [],
  isLoading: false,
  error: null,
  lastFetched: [],
};

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    clearObjectsError: (state) => {
      state.error = null;
    },
    setInitialOfflineData: (
      state,
      action: PayloadAction<{ offlineQueue: ObjectFormInput[]; lastFetched: ObjectData[] }>
    ) => {
      state.offlineQueue = action.payload.offlineQueue;
      state.lastFetched = action.payload.lastFetched;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createObjectAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createObjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if ('isOffline' in action.payload && action.payload.isOffline) {
          const tempId = (action.payload as any).tempId || String(state.offlineQueue.length + 1);
          state.error = formatString(strings.messages.error.dataSavedLocally, { id: tempId });
          state.offlineQueue.push(action.payload.data as ObjectFormInput);
        } else {
          const newObject = action.payload as ObjectData;
          state.objects.push(newObject);
          state.error = formatString(strings.messages.success.objectCreated, { id: newObject.id || '' });
        }
      })
      .addCase(createObjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchObjectsByIdsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchObjectsByIdsAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if ('isOffline' in action.payload && action.payload.isOffline) {
          state.error = action.payload.message || strings.messages.error.offlineDisplay;
        } else {
          state.lastFetched = action.payload as ObjectData[];
          state.error = strings.messages.success.objectsFetched;
        }
      })
      .addCase(fetchObjectsByIdsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(syncOfflineQueueAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncOfflineQueueAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offlineQueue = action.payload.remainingItems || [];
        
        if (action.payload.idMapping) {
          const idMapping = action.payload.idMapping;
          state.lastFetched = state.lastFetched.map(obj => {
            if (obj.id && idMapping[obj.id]) {
              return { ...obj, id: idMapping[obj.id] };
            }
            return obj;
          });
        }
        
        if (action.payload.synced > 0 && action.payload.failed === 0) {
          state.error = formatString(strings.messages.success.syncSuccess, { count: action.payload.synced });
        } else if (action.payload.synced > 0 && action.payload.failed > 0) {
          state.error = formatString(strings.messages.success.syncPartial, { 
            synced: action.payload.synced, 
            failed: action.payload.failed, 
            remaining: action.payload.remaining || 0
          });
        } else if (action.payload.synced === 0 && action.payload.failed > 0) {
          state.error = formatString(strings.messages.success.syncFailed, { 
            failed: action.payload.failed, 
            remaining: action.payload.remaining || 0
          });
        }
      })
      .addCase(syncOfflineQueueAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearObjectsError, setInitialOfflineData } = objectsSlice.actions;
export default objectsSlice.reducer;

