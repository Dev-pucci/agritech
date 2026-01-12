import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MarketPricesScreen from '../screens/market/MarketPricesScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

export default function MarketStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MarketPrices"
        component={MarketPricesScreen}
        options={{ title: 'Markets' }}
      />
    </Stack.Navigator>
  );
}
