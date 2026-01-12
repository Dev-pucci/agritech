import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrendingUp, Newspaper } from 'lucide-react-native';
import MarketPricesScreen from '../screens/market/MarketPricesScreen';
import NewsScreen from '../screens/market/NewsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export default function MarketStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="MarketPrices"
        component={MarketPricesScreen}
        options={{
          title: 'Prices',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
