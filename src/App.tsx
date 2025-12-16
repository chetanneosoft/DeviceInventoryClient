import React from 'react';
import StoreProvider from './providers/StoreProvider';
import NavigationProvider from './providers/NavigationProvider';
import OfflineSyncProvider from './providers/OfflineSyncProvider';
import ErrorBoundary from './providers/ErrorBoundary/ErrorBoundary';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <OfflineSyncProvider>
          <NavigationProvider>
            <AppNavigator />
          </NavigationProvider>
        </OfflineSyncProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;

