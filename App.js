import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStateProvider } from './app/context/AppStateContext';
import MainScreen from './app/screens/MainScreen';
import ErrorBoundary from './app/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    const checkForOTAUpdate = async () => {
      if (__DEV__ || !Updates.isEnabled) return;
      try {
        const result = await Updates.checkForUpdateAsync();
        if (!result.isAvailable) return;
        const fetched = await Updates.fetchUpdateAsync();
        if (!fetched.isNew) return;
        Alert.alert(
          'Update Ready',
          'A new version of Rested is ready to install.',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Reload',
              onPress: () => {
                Updates.reloadAsync().catch((err) =>
                  console.error('Reload after update failed:', err)
                );
              },
            },
          ]
        );
      } catch (error) {
        console.error('OTA update check failed:', error);
      }
    };
    checkForOTAUpdate();
  }, []);

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
