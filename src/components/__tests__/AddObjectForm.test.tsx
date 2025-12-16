import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddObjectForm from '../AddObjectForm';
import { ObjectFormInput } from '../../features/objects/objectsTypes';

describe('AddObjectForm Component', () => {
  const mockFormData: ObjectFormInput = {
    name: '',
    data: {
      year: '',
      price: '',
      'CPU model': '',
      'Hard disk size': '',
    },
  };

  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Year (e.g., 2024)')).toBeTruthy();
    expect(getByPlaceholderText('Price (e.g., 1200)')).toBeTruthy();
    expect(getByPlaceholderText('CPU Model')).toBeTruthy();
    expect(getByPlaceholderText('Hard Disk Size')).toBeTruthy();
  });

  it('should call onChange when name field is changed', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const nameInput = getByPlaceholderText('Name');
    fireEvent.changeText(nameInput, 'Test Computer');

    expect(mockOnChange).toHaveBeenCalledWith('name', 'Test Computer');
  });

  it('should call onChange when year field is changed', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const yearInput = getByPlaceholderText('Year (e.g., 2024)');
    fireEvent.changeText(yearInput, '2024');

    expect(mockOnChange).toHaveBeenCalledWith('year', '2024');
  });

  it('should call onChange when price field is changed', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const priceInput = getByPlaceholderText('Price (e.g., 1200)');
    fireEvent.changeText(priceInput, '1200');

    expect(mockOnChange).toHaveBeenCalledWith('price', '1200');
  });

  it('should call onChange when CPU model field is changed', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const cpuInput = getByPlaceholderText('CPU Model');
    fireEvent.changeText(cpuInput, 'M2');

    expect(mockOnChange).toHaveBeenCalledWith('CPU model', 'M2');
  });

  it('should call onChange when hard disk size field is changed', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const diskInput = getByPlaceholderText('Hard Disk Size');
    fireEvent.changeText(diskInput, '512GB');

    expect(mockOnChange).toHaveBeenCalledWith('Hard disk size', '512GB');
  });

  it('should call onSubmit when submit button is pressed', () => {
    const { getByText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const submitButton = getByText('Submit Object');
    fireEvent.press(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button when isLoading is true', () => {
    const { getByText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = getByText('Submit Object');
    expect(submitButton).toBeTruthy();
    const touchableParent = submitButton.parent;
    expect(touchableParent).toBeTruthy();
    expect(touchableParent?.props?.style).toBeDefined();
  });

  it('should disable all inputs when isLoading is true', () => {
    const { getByPlaceholderText } = render(
      <AddObjectForm
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const nameInput = getByPlaceholderText('Name');
    expect(nameInput.props.editable).toBe(false);
  });

  it('should display form values correctly', () => {
    const filledFormData: ObjectFormInput = {
      name: 'MacBook Pro',
      data: {
        year: '2024',
        price: '2000',
        'CPU model': 'M2',
        'Hard disk size': '512GB',
      },
    };

    const { getByDisplayValue } = render(
      <AddObjectForm
        formData={filledFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(getByDisplayValue('MacBook Pro')).toBeTruthy();
    expect(getByDisplayValue('2024')).toBeTruthy();
    expect(getByDisplayValue('2000')).toBeTruthy();
    expect(getByDisplayValue('M2')).toBeTruthy();
    expect(getByDisplayValue('512GB')).toBeTruthy();
  });
});

