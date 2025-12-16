import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

interface NavigationProviderProps {
  children: React.ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

export default NavigationProvider;

