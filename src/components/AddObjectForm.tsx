import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ObjectFormInput } from '../features/objects/objectsTypes';
import { strings } from '../constants/strings';
import { scaleSize, Spacing } from '../config/dimensions';

interface AddObjectFormProps {
  formData: ObjectFormInput;
  onChange: (key: keyof ObjectFormInput['data'] | 'name', value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const AddObjectForm: React.FC<AddObjectFormProps> = ({ formData, onChange, onSubmit, isLoading }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={strings.form.placeholders.name}
        placeholderTextColor="#999999"
        value={formData.name}
        onChangeText={(text) => onChange('name', text)}
        style={styles.input}
        editable={!isLoading}
        underlineColorAndroid="transparent"
      />

      <TextInput
        placeholder={strings.form.placeholders.year}
        placeholderTextColor="#999999"
        value={formData.data.year}
        onChangeText={(text) => onChange('year', text)}
        keyboardType="numeric"
        style={styles.input}
        editable={!isLoading}
        underlineColorAndroid="transparent"
      />

      <TextInput
        placeholder={strings.form.placeholders.price}
        placeholderTextColor="#999999"
        value={formData.data.price}
        onChangeText={(text) => onChange('price', text)}
        keyboardType="numeric"
        style={styles.input}
        editable={!isLoading}
        underlineColorAndroid="transparent"
      />

      <TextInput
        placeholder={strings.form.placeholders.cpuModel}
        placeholderTextColor="#999999"
        value={formData.data['CPU model']}
        onChangeText={(text) => onChange('CPU model', text)}
        style={styles.input}
        editable={!isLoading}
        underlineColorAndroid="transparent"
      />

      <TextInput
        placeholder={strings.form.placeholders.hardDiskSize}
        placeholderTextColor="#999999"
        value={formData.data['Hard disk size']}
        onChangeText={(text) => onChange('Hard disk size', text)}
        style={styles.input}
        editable={!isLoading}
        underlineColorAndroid="transparent"
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{strings.form.submitButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
  },
  input: {
    height: scaleSize(50),
    borderColor: '#E5E5E5',
    borderWidth: scaleSize(1),
    marginBottom: Spacing.m,
    paddingHorizontal: scaleSize(12),
    borderRadius: scaleSize(8),
    backgroundColor: '#FFFFFF',
    fontSize: scaleSize(16),
    color: '#000000',
    textAlignVertical: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: scaleSize(14),
    borderRadius: scaleSize(8),
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  buttonDisabled: {
    backgroundColor: '#8A8A8E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleSize(16),
    fontWeight: '600',
  },
});

export default AddObjectForm;

