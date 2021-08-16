import { ValidationResult, Validator } from 'types';

export function makeValidator<T>(
  validateX: (value: T) => ValidationResult,
): Validator<T> {
  return {
    validate: validateX,
    join: (validatorY: Validator<T>) => {
      return makeValidator<T>((value: T) => {
        const resultForX = validateX(value);

        switch (resultForX.kind) {
          case 'invalid':
            return resultForX;
          case 'valid': {
            const resultForY = validatorY.validate(value);
            switch (resultForY.kind) {
              case 'invalid':
                return resultForY;
              case 'valid':
                return { kind: 'valid' };
            }
          }
        }
      });
    },
  };
}
