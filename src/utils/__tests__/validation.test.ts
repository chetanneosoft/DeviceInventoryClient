import { validateNewObjectData, parseIdsToQuery, ObjectFormInput } from '../validation';

describe('Validation Utility Tests', () => {
  describe('validateNewObjectData', () => {
    const validFormData: ObjectFormInput = {
      name: 'Test Computer',
      data: {
        year: '2024',
        price: '1200',
        'CPU model': 'M2',
        'Hard disk size': '512GB',
      },
    };

    it('should return null for valid form data', () => {
      const result = validateNewObjectData(validFormData);
      expect(result).toBeNull();
    });

    it('should return error if name is empty', () => {
      const invalidData = { ...validFormData, name: '' };
      const result = validateNewObjectData(invalidData);
      expect(result).toBe('Object name is required.');
    });

    it('should return error if year is invalid', () => {
      const invalidData = { ...validFormData, data: { ...validFormData.data, year: '1800' } };
      const result = validateNewObjectData(invalidData);
      expect(result).toContain('valid year');
    });

    it('should return error if price is invalid', () => {
      const invalidData = { ...validFormData, data: { ...validFormData.data, price: '-100' } };
      const result = validateNewObjectData(invalidData);
      expect(result).toContain('valid price');
    });

    it('should return error if CPU model is empty', () => {
      const invalidData = { ...validFormData, data: { ...validFormData.data, 'CPU model': '' } };
      const result = validateNewObjectData(invalidData);
      expect(result).toBe('CPU Model is required.');
    });

    it('should return error if hard disk size is empty', () => {
      const invalidData = {
        ...validFormData,
        data: { ...validFormData.data, 'Hard disk size': '' },
      };
      const result = validateNewObjectData(invalidData);
      expect(result).toBe('Hard Disk Size is required.');
    });
  });

  describe('parseIdsToQuery', () => {
    it('should correctly convert comma-separated IDs to API query format', () => {
      const input = '3,5,10';
      const expected = 'id=3&id=5&id=10';
      expect(parseIdsToQuery(input)).toBe(expected);
    });

    it('should handle whitespace and filter out invalid IDs', () => {
      const input = ' 8 , , 9a, 12, ';
      const expected = 'id=8&id=12';
      expect(parseIdsToQuery(input)).toBe(expected);
    });

    it('should return empty string for completely invalid input', () => {
      const input = 'a, b, c';
      expect(parseIdsToQuery(input)).toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(parseIdsToQuery('')).toBe('');
      expect(parseIdsToQuery('   ')).toBe('');
    });

    it('should filter out zero and negative numbers', () => {
      const input = '3,0,-5,10';
      const expected = 'id=3&id=10';
      expect(parseIdsToQuery(input)).toBe(expected);
    });
  });
});

