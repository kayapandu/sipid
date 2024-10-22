import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../presentations/screens/Home/Home.screen';
import Playlist from '../presentations/screens/Playlist/Playlist.screen';

const Stack = createNativeStackNavigator();

export default function Navigation () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{
        headerTitle: '',
        headerShadowVisible: false,
        statusBarHidden: true,
        headerShown: false,
      }} />
      <Stack.Screen
        name="Playlist"
        component={Playlist}
        options={{
          headerBackButtonMenuEnabled: true,
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerTitle: 'PID Playlist',
        }}
      />
    </Stack.Navigator>
  );
}
