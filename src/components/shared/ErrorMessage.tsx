import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
  isGlobal?: boolean;
  onDismiss?: () => void;
  autoDismissDelay?: number;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  isGlobal = false,
  onDismiss,
  autoDismissDelay = 2000 
}) => {
  useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss, autoDismissDelay]);

  if (!message) return null;

  return (
    <View style={[styles.container, isGlobal && styles.globalContainer]}>
      <Text style={[styles.text, isGlobal && styles.globalText]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  globalContainer: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
  },
  text: {
    color: '#C62828',
    fontSize: 14,
  },
  globalText: {
    color: '#E65100',
  },
});

export default ErrorMessage;

