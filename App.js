import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStateProvider } from './app/context/AppStateContext';
import MainScreen from './app/screens/MainScreen';
import ErrorBoundary from './app/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppStateProvider>
          <MainScreen />
        </AppStateProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
