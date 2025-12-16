import { strings } from '../constants/strings';

export interface ObjectFormInput {
  name: string;
  data: {
    year: string;
    price: string;
    'CPU model': string;
    'Hard disk size': string;
  };
}

export const validateNewObjectData = (data: ObjectFormInput): string | null => {
  if (!data) {
    return strings.form.validation.formDataRequired;
  }

  if (!data.name || data.name.trim() === '') {
    return strings.form.validation.nameRequired;
  }

  if (!data.data) {
    return strings.form.validation.detailsRequired;
  }

  if (!data.data.year || data.data.year.trim() === '') {
    return strings.form.validation.yearRequired;
  }
  const yearNum = Number(data.data.year);
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
    return strings.form.validation.yearInvalid;
  }

  if (!data.data.price || data.data.price.trim() === '') {
    return strings.form.validation.priceRequired;
  }
  const priceNum = Number(data.data.price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return strings.form.validation.priceInvalid;
  }

  if (!data.data['CPU model'] || data.data['CPU model'].trim() === '') {
    return strings.form.validation.cpuModelRequired;
  }

  if (!data.data['Hard disk size'] || data.data['Hard disk size'].trim() === '') {
    return strings.form.validation.hardDiskSizeRequired;
  }

  return null;
};

export const parseIdsToQuery = (idsString: string): string => {
  if (!idsString || idsString.trim() === '') {
    return '';
  }

  const ids = idsString.split(',').map(id => id.trim()).filter(id => id);
  
  const apiIds = ids.filter(id => !isNaN(Number(id)) && Number(id) > 0);

  const validIds = apiIds.map(validId => `id=${validId}`);

  return validIds.length > 0 ? validIds.join('&') : '';
};

