import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ObjectData } from '../features/objects/objectsTypes';
import { strings, formatString } from '../constants/strings';
import { scaleSize, Spacing } from '../config/dimensions';

interface ObjectDetailsCardProps {
  object: ObjectData;
}

const ObjectDetailsCard: React.FC<ObjectDetailsCardProps> = ({ object }) => {
  if (!object) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>{strings.objectDetails.invalidData}</Text>
      </View>
    );
  }

  const renderDataFields = () => {
    if (!object.data || typeof object.data !== 'object') {
      return (
        <Text style={styles.detailText}>{strings.objectDetails.noDataAvailable}</Text>
      );
    }

    return Object.entries(object.data).map(([key, value]) => {
      const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      const displayValue = value !== null && value !== undefined ? String(value) : strings.objectDetails.notAvailable;
      
      return (
        <Text key={key} style={styles.detailText}>
          {displayKey}: {displayValue}
        </Text>
      );
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.id}>{formatString(strings.objectDetails.id, { id: object.id || strings.objectDetails.notAvailable })}</Text>
      <Text style={styles.name}>{object.name || strings.objectDetails.notAvailable}</Text>
      <View style={styles.details}>
        {renderDataFields()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.m,
    marginVertical: Spacing.s,
    marginHorizontal: Spacing.m,
    borderRadius: scaleSize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleSize(2) },
    shadowOpacity: 0.1,
    shadowRadius: scaleSize(4),
    elevation: 3,
  },
  id: {
    fontSize: scaleSize(12),
    color: '#666',
    marginBottom: scaleSize(4),
  },
  name: {
    fontSize: scaleSize(18),
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: scaleSize(12),
  },
  details: {
    marginTop: Spacing.s,
  },
  detailText: {
    fontSize: scaleSize(14),
    color: '#333',
    marginVertical: scaleSize(4),
  },
  errorText: {
    fontSize: scaleSize(14),
    color: '#F44336',
    textAlign: 'center',
    padding: Spacing.m,
  },
});

export default ObjectDetailsCard;

