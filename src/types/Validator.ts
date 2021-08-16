import { Translations } from './Language';

type ValidResult = {
  kind: 'valid';
};

type InvalidResult = {
  kind: 'invalid';
  message: Translations;
};

export type ValidationResult = ValidResult | InvalidResult;

export type Validator<T> = {
  join(validator: Validator<T>): Validator<T>;
  validate(value: T): ValidationResult;
};
