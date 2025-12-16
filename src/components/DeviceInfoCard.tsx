import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

interface DeviceInfoData {
  deviceName: string;
  brand: string;
  model: string;
  systemName: string;
  systemVersion: string;
  deviceId: string;
  totalMemory: string;
  usedMemory: string;
}

const DeviceInfoCard: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData | null>(null);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        const [deviceName, brand, model, systemName, systemVersion, deviceId, totalMemory] =
          await Promise.all([
            DeviceInfo.getDeviceName(),
            DeviceInfo.getBrand(),
            DeviceInfo.getModel(),
            DeviceInfo.getSystemName(),
            DeviceInfo.getSystemVersion(),
            DeviceInfo.getDeviceId(),
            DeviceInfo.getTotalMemory(),
          ]);

        const totalMemoryGB = (totalMemory / (1024 * 1024 * 1024)).toFixed(2);

        setDeviceInfo({
          deviceName: deviceName || 'Unknown',
          brand: brand || 'Unknown',
          model: model || 'Unknown',
          systemName: systemName || 'Unknown',
          systemVersion: systemVersion || 'Unknown',
          deviceId: deviceId || 'Unknown',
          totalMemory: `${totalMemoryGB} GB`,
          usedMemory: 'N/A',
        });
      } catch (error) {
      }
    };

    loadDeviceInfo();
  }, []);

  if (!deviceInfo) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading device information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Device Information</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Device Name:</Text>
          <Text style={styles.value}>{deviceInfo.deviceName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Brand:</Text>
          <Text style={styles.value}>{deviceInfo.brand}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{deviceInfo.model}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>OS:</Text>
          <Text style={styles.value}>
            {deviceInfo.systemName} {deviceInfo.systemVersion}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Device ID:</Text>
          <Text style={styles.value}>{deviceInfo.deviceId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Total Memory:</Text>
          <Text style={styles.value}>{deviceInfo.totalMemory}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'right',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default DeviceInfoCard;

