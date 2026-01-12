import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FarmDashboardScreen from '../screens/farm/FarmDashboardScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

export default function FarmStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="FarmDashboard"
        component={FarmDashboardScreen}
        options={{ title: 'My Farm' }}
      />
    </Stack.Navigator>
  );
}
