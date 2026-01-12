import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScannerHomeScreen from '../screens/scanner/ScannerHomeScreen';
import CropHealthScreen from '../screens/scanner/CropHealthScreen';
import SoilAnalysisScreen from '../screens/scanner/SoilAnalysisScreen';
import PestScreen from '../screens/scanner/PestScreen';
import FertilizerScreen from '../screens/scanner/FertilizerScreen';
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
      <Stack.Screen
        name="CropHealth"
        component={CropHealthScreen}
        options={{ title: 'Crop Health Analysis' }}
      />
      <Stack.Screen
        name="SoilAnalysis"
        component={SoilAnalysisScreen}
        options={{ title: 'Soil Analysis' }}
      />
      <Stack.Screen
        name="PestDetection"
        component={PestScreen}
        options={{ title: 'Pest Detection' }}
      />
      <Stack.Screen
        name="Fertilizer"
        component={FertilizerScreen}
        options={{ title: 'Fertilizer Recommendations' }}
      />
    </Stack.Navigator>
  );
}
