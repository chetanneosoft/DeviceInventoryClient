import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp as NavigationRouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../shared/hooks/useAppDispatch';
import { useAppSelector } from '../shared/hooks/useAppSelector';
import { fetchObjectsByIdsAsync } from '../features/objects/objectsThunks';
import { clearObjectsError } from '../features/objects/objectsSlice';
import { RootState } from '../store/store';
import { parseIdsToQuery } from '../utils/validation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import LoadingOverlay from '../components/shared/LoadingOverlay';
import ErrorMessage from '../components/shared/ErrorMessage';
import SuccessMessage from '../components/shared/SuccessMessage';
import ObjectDetailsCard from '../components/ObjectDetailsCard';
import { RootStackParamList } from '../navigation/navigationTypes';
import { strings, formatString } from '../constants/strings';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GetObjectsRouteProp = NavigationRouteProp<RootStackParamList, 'GetObjects'>;

const GetObjectsByIdScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GetObjectsRouteProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, lastFetched } = useAppSelector((state: RootState) => state.objects);
  const netStatus = useNetworkStatus();

  const [idsInput, setIdsInput] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState<boolean>(false);

  const isOffline = netStatus?.isConnected === false;

  useEffect(() => {
    if (route.params?.initialId) {
      setIdsInput(route.params.initialId);
      dispatch(fetchObjectsByIdsAsync(route.params.initialId));
    }
  }, [route.params?.initialId, dispatch]);

  useEffect(() => {
    if (error && error.toLowerCase().includes('successfully')) {
      const timer = setTimeout(() => {
        dispatch(clearObjectsError());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isOffline) {
      setShowOfflineBanner(true);
      const timer = setTimeout(() => {
        setShowOfflineBanner(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowOfflineBanner(false);
    }
  }, [isOffline]);

  const handleSubmit = () => {
    setLocalError(null);

    if (!idsInput.trim()) {
      setLocalError(strings.screens.getObjectsById.errors.emptyIds);
      return;
    }

    const ids = idsInput.split(',').map(id => id.trim()).filter(id => id);
    const hasValidIds = ids.some(id => {
      return id.startsWith('offline-') || (!isNaN(Number(id)) && Number(id) > 0);
    });

    if (!hasValidIds) {
      setLocalError(strings.screens.getObjectsById.errors.invalidIds);
      return;
    }

    dispatch(fetchObjectsByIdsAsync(idsInput));
  };

  const objectsToDisplay = lastFetched.filter(obj => obj && obj.name);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
          <Text style={styles.title}>{strings.screens.getObjectsById.title}</Text>
          <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddObject')}
              activeOpacity={0.8}
          >
              <Text style={styles.addButtonText}>{strings.common.addButton}</Text>
        </TouchableOpacity>
          </View>

        {isOffline && showOfflineBanner && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              {strings.screens.getObjectsById.offlineBanner}
            </Text>
          </View>
        )}

        <View style={styles.inputSection}>
          <TextInput
            placeholder={strings.screens.getObjectsById.placeholder}
            placeholderTextColor="#999999"
            value={idsInput}
            onChangeText={setIdsInput}
            style={styles.input}
            editable={!isLoading}
            underlineColorAndroid="transparent"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{strings.screens.getObjectsById.fetchButton}</Text>
          </TouchableOpacity>
        </View>

        {objectsToDisplay.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>{strings.screens.getObjectsById.resultsTitle}</Text>
            {objectsToDisplay.map((item) => (
              <ObjectDetailsCard key={item.id || Math.random().toString()} object={item} />
            ))}
          </View>
        )}

        {objectsToDisplay.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {strings.screens.getObjectsById.emptyMessage}
            </Text>
          </View>
        )}
        </ScrollView>

        {isLoading && <LoadingOverlay />}

        <View style={styles.bottomMessageContainer}>
          {localError && (
            <ErrorMessage 
              message={localError} 
              onDismiss={() => setLocalError(null)}
            />
          )}
          {error && error.toLowerCase().includes('successfully') ? (
            <SuccessMessage 
              message={error} 
              onDismiss={() => dispatch(clearObjectsError())}
            />
          ) : (
            error && (
              <ErrorMessage 
                message={error} 
                isGlobal={true}
                onDismiss={() => dispatch(clearObjectsError())}
              />
            )
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  offlineBanner: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  offlineText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '500',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000000', 
    textAlignVertical: 'center', 
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#8A8A8E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'transparent',
  },
});

export default GetObjectsByIdScreen;

