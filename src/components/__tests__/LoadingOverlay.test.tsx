import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingOverlay from '../shared/LoadingOverlay';

describe('LoadingOverlay Component', () => {
  it('should render loading indicator', () => {
    const { UNSAFE_root } = render(<LoadingOverlay />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should be visible when rendered', () => {
    const { root } = render(<LoadingOverlay />);
    expect(root).toBeTruthy();
  });

  it('should render without crashing', () => {
    expect(() => render(<LoadingOverlay />)).not.toThrow();
  });
});

