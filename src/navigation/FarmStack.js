import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FarmDashboardScreen from '../screens/farm/FarmDashboardScreen';
import PlantingScreen from '../screens/farm/PlantingScreen';
import HarvestScreen from '../screens/farm/HarvestScreen';
import IrrigationScreen from '../screens/farm/IrrigationScreen';
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
      <Stack.Screen
        name="Planting"
        component={PlantingScreen}
        options={{ title: 'Planting Schedule' }}
      />
      <Stack.Screen
        name="Harvest"
        component={HarvestScreen}
        options={{ title: 'Harvest Tracking' }}
      />
      <Stack.Screen
        name="Irrigation"
        component={IrrigationScreen}
        options={{ title: 'Irrigation Management' }}
      />
    </Stack.Navigator>
  );
}
