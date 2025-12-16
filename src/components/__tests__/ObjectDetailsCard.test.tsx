import React from 'react';
import { render } from '@testing-library/react-native';
import ObjectDetailsCard from '../ObjectDetailsCard';
import { ObjectData } from '../../features/objects/objectsTypes';

describe('ObjectDetailsCard Component', () => {
  it('should render object details correctly', () => {
    const mockObject: ObjectData = {
      id: '1',
      name: 'MacBook Pro',
      data: {
        year: 2024,
        price: 2000,
        'CPU model': 'M2',
        'Hard disk size': '512GB',
      },
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('ID: 1')).toBeTruthy();
    expect(getByText('MacBook Pro')).toBeTruthy();
    expect(getByText(/Year:/)).toBeTruthy();
    expect(getByText(/Price:/)).toBeTruthy();
    expect(getByText(/C P U model:/i)).toBeTruthy();
    expect(getByText(/Hard disk size:/i)).toBeTruthy();
  });

  it('should handle object with null data', () => {
    const mockObject: ObjectData = {
      id: '2',
      name: 'iPhone 12',
      data: null,
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('ID: 2')).toBeTruthy();
    expect(getByText('iPhone 12')).toBeTruthy();
    expect(getByText('No additional data available')).toBeTruthy();
  });

  it('should handle object with different data structure', () => {
    const mockObject: ObjectData = {
      id: '3',
      name: 'Google Pixel',
      data: {
        color: 'White',
        capacity: '128 GB',
      },
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('ID: 3')).toBeTruthy();
    expect(getByText('Google Pixel')).toBeTruthy();
    expect(getByText(/Color:/)).toBeTruthy();
    expect(getByText(/Capacity:/)).toBeTruthy();
  });

  it('should display N/A for missing id', () => {
    const mockObject: ObjectData = {
      name: 'Test Device',
      data: {
        year: 2024,
      },
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('ID: N/A')).toBeTruthy();
  });

  it('should display N/A for missing name', () => {
    const mockObject: ObjectData = {
      id: '1',
      name: '',
      data: {
        year: 2024,
      },
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('N/A')).toBeTruthy();
  });

  it('should handle invalid object', () => {
    const { getByText } = render(<ObjectDetailsCard object={null as any} />);

    expect(getByText('Invalid object data')).toBeTruthy();
  });

  it('should render all data fields dynamically', () => {
    const mockObject: ObjectData = {
      id: '7',
      name: 'Apple MacBook Pro 16',
      data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
      },
    };

    const { getByText } = render(<ObjectDetailsCard object={mockObject} />);

    expect(getByText('ID: 7')).toBeTruthy();
    expect(getByText('Apple MacBook Pro 16')).toBeTruthy();
    expect(getByText(/Year: 2019/)).toBeTruthy();
    expect(getByText(/Price: 1849.99/)).toBeTruthy();
    expect(getByText(/C P U model: Intel Core i9/i)).toBeTruthy();
    expect(getByText(/Hard disk size: 1 TB/i)).toBeTruthy();
  });
});

