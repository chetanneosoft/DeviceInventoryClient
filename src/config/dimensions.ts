import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const baseWidth = 375; 

const scale = width / baseWidth;

export const scaleSize = (size: number): number => size * scale;

export const Spacing = {
  s: scaleSize(8),
  m: scaleSize(16),
  l: scaleSize(24),
};