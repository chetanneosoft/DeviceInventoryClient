import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../shared/hooks/useAppDispatch';
import { useAppSelector } from '../shared/hooks/useAppSelector';
import { createObjectAsync } from '../features/objects/objectsThunks';
import { clearObjectsError } from '../features/objects/objectsSlice';
import { RootState } from '../store/store';
import { ObjectFormInput } from '../features/objects/objectsTypes';
import { validateNewObjectData } from '../utils/validation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import AddObjectForm from '../components/AddObjectForm';
import LoadingOverlay from '../components/shared/LoadingOverlay';
import ErrorMessage from '../components/shared/ErrorMessage';
import SuccessMessage from '../components/shared/SuccessMessage';
import { RootStackParamList } from '../navigation/navigationTypes';
import { strings } from '../constants/strings';
import { scaleSize, Spacing } from '../config/dimensions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const initialFormState: ObjectFormInput = {
  name: '',
  data: {
    year: '',
    price: '',
    'CPU model': '',
    'Hard disk size': '',
  },
};

const AddObjectScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.objects);
  const netStatus = useNetworkStatus();

  const [formData, setFormData] = useState<ObjectFormInput>(initialFormState);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState<boolean>(false);

  const isOffline = netStatus?.isConnected === false;

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

  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes('successfully')) {
        const timer = setTimeout(() => {
          dispatch(clearObjectsError());
        }, 2000);

        return () => clearTimeout(timer);
      } else if (error.includes('Data saved locally') && error.includes('ID:')) {
        const idMatch = error.match(/ID:\s*([^\s\)]+)/);
        if (idMatch && idMatch[1]) {
          const tempId = idMatch[1];
          const timer = setTimeout(() => {
            navigation.navigate('GetObjects', { initialId: tempId });
            dispatch(clearObjectsError());
          }, 1500);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [error, dispatch, navigation]);

  const handleChange = (key: keyof ObjectFormInput['data'] | 'name', value: string) => {
    setFormData((prev) => ({
      ...prev,
      ...(key === 'name' ? { name: value } : { data: { ...prev.data, [key]: value } }),
    }));
  };

  const handleSubmit = () => {
    setLocalError(null);
    dispatch(clearObjectsError());

    const validationError = validateNewObjectData(formData);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    dispatch(createObjectAsync(formData));
    setFormData(initialFormState);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{strings.screens.addObject.title}</Text>

        <AddObjectForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && <LoadingOverlay />}
      </ScrollView>

      <View style={styles.bottomMessageContainer}>
        {isOffline && showOfflineBanner && (
          <ErrorMessage 
            message={strings.screens.addObject.offlineBanner}
            isGlobal={true}
            onDismiss={() => setShowOfflineBanner(false)}
          />
        )}
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
  scrollContent: {
    paddingBottom: Spacing.l,
  },
  title: {
    fontSize: scaleSize(24),
    fontWeight: 'bold',
    margin: Spacing.l,
    color: '#1C1C1E',
  },
  bottomMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.l,
    paddingBottom: Platform.OS === 'ios' ? Spacing.l : Spacing.s,
    backgroundColor: 'transparent',
  },
});

export default AddObjectScreen;

