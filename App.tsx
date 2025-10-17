import "./global.css";
import React from 'react';
import './src/i18n';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View className="flex-1 bg-black items-center justify-center">
            <Text className="text-white text-xl">Ładowanie...</Text>
          </View>
        } 
        persistor={persistor}
      >
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}