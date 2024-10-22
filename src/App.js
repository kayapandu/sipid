/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Suspense, useEffect, useState } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import Navigation from './navigation/navigation';
import { ActivityIndicator, Alert } from 'react-native';
import { PaperProvider } from 'react-native-paper';




function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <Suspense
          fallback={<ActivityIndicator size="large" color="#0000ff" />}
        >
          <Navigation/>
        </Suspense>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
