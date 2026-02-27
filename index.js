/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import App from './App';
import {name as appName} from './app.json';

// Create the client directly here — avoids any import/undefined issues
const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);