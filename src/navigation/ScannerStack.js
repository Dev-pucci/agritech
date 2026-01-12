import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScannerHomeScreen from '../screens/scanner/ScannerHomeScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

export default function ScannerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ScannerHome"
        component={ScannerHomeScreen}
        options={{ title: 'AI Scanner' }}
      />
    </Stack.Navigator>
  );
}
