import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SuccessMessage from '../SuccessMessage';

jest.useFakeTimers();

describe('SuccessMessage', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('should render message', () => {
    const { getByText } = render(
      <SuccessMessage message="Success message" />
    );
    expect(getByText('Success message')).toBeTruthy();
  });

  it('should not render when message is empty', () => {
    const { queryByText } = render(
      <SuccessMessage message="" />
    );
    expect(queryByText('Success message')).toBeNull();
  });

  it('should auto-dismiss after default delay', async () => {
    const onDismiss = jest.fn();
    render(
      <SuccessMessage message="Success message" onDismiss={onDismiss} />
    );

    expect(onDismiss).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('should auto-dismiss after custom delay', async () => {
    const onDismiss = jest.fn();
    render(
      <SuccessMessage 
        message="Success message" 
        onDismiss={onDismiss}
        autoDismissDelay={5000}
      />
    );

    jest.advanceTimersByTime(2000);
    expect(onDismiss).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('should not auto-dismiss when onDismiss is not provided', () => {
    const { getByText } = render(
      <SuccessMessage message="Success message" />
    );
    
    jest.advanceTimersByTime(2000);
    expect(getByText('Success message')).toBeTruthy();
  });

  it('should clear timer on unmount', () => {
    const onDismiss = jest.fn();
    const { unmount } = render(
      <SuccessMessage message="Success message" onDismiss={onDismiss} />
    );

    unmount();
    jest.advanceTimersByTime(2000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('should reset timer when message changes', async () => {
    const onDismiss = jest.fn();
    const { rerender } = render(
      <SuccessMessage message="First message" onDismiss={onDismiss} />
    );

    jest.advanceTimersByTime(1000);
    rerender(<SuccessMessage message="Second message" onDismiss={onDismiss} />);
    
    jest.advanceTimersByTime(1000);
    expect(onDismiss).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});

