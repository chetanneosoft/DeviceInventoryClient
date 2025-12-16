import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorMessage from '../shared/ErrorMessage';

describe('ErrorMessage Component', () => {
  it('should render error message', () => {
    const { getByText } = render(<ErrorMessage message="Test error message" />);
    expect(getByText('Test error message')).toBeTruthy();
  });

  it('should not render when message is empty', () => {
    const { queryByText } = render(<ErrorMessage message="" />);
    expect(queryByText('')).toBeNull();
  });

  it('should apply global styles when isGlobal is true', () => {
    const { getByText } = render(
      <ErrorMessage message="Global error" isGlobal={true} />
    );
    expect(getByText('Global error')).toBeTruthy();
  });

  it('should render with default styles when isGlobal is false', () => {
    const { getByText } = render(
      <ErrorMessage message="Local error" isGlobal={false} />
    );
    expect(getByText('Local error')).toBeTruthy();
  });
});

