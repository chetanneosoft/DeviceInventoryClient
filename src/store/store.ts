import { configureStore } from '@reduxjs/toolkit';
import objectsReducer from '../features/objects/objectsSlice';

export const store = configureStore({
  reducer: {
    objects: objectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['objects/createObject/fulfilled', 'objects/fetchObjectsByIds/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

