import { Translations, ValidationResult } from 'types';

import { makeValidator } from './makeValidator';

const message: Translations = {
  en: 'Field is required',
  ru: 'Поле обязательно',
};

export const nonEmptyString = makeValidator(
  (value: string): ValidationResult =>
    value === '' ? { kind: 'invalid', message } : { kind: 'valid' },
);
