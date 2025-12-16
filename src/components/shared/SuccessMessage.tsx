import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoDismissDelay?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
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
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  text: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SuccessMessage;

