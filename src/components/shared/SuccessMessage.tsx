import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scaleSize, Spacing } from '../../config/dimensions';

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
    padding: scaleSize(12),
    borderRadius: scaleSize(8),
    marginVertical: Spacing.s,
    marginHorizontal: Spacing.l,
    borderLeftWidth: scaleSize(4),
    borderLeftColor: '#FF9800',
  },
  text: {
    color: '#E65100',
    fontSize: scaleSize(14),
    fontWeight: '500',
  },
});

export default SuccessMessage;

