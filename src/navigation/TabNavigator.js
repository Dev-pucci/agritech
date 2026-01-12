import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Search, Sprout, TrendingUp, User } from 'lucide-react-native';
import { colors } from '../theme';

import ScannerStack from './ScannerStack';
import FarmStack from './FarmStack';
import MarketStack from './MarketStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Scanner"
        component={ScannerStack}
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          tabBarLabel: 'Scanner',
        }}
      />
      <Tab.Screen
        name="Farm"
        component={FarmStack}
        options={{
          tabBarIcon: ({ color, size }) => <Sprout color={color} size={size} />,
          tabBarLabel: 'My Farm',
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketStack}
        options={{
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
          tabBarLabel: 'Markets',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
