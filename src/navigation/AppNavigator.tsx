import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigationTypes';
import AddObjectScreen from '../screens/AddObjectScreen';
import GetObjectsByIdScreen from '../screens/GetObjectsByIdScreen';
import { strings } from '../constants/strings';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="GetObjects"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AddObject"
        component={AddObjectScreen}
        options={{ 
          title: strings.navigation.addObject,
          headerBackVisible: true,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="GetObjects"
        component={GetObjectsByIdScreen}
        options={{ 
          title: strings.navigation.deviceInventory,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

