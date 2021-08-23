import { useCallback } from 'react';

import { Translations, Validator } from 'types';
import { makePrimaryUnit, makeDerivedUnit } from 'utils/State';

import { composeContextProviders } from '../react';
import { FormElementState } from './FormElementState';

export function makeFormElementState<T>(
  initialValue: T,
  validator?: Validator<T>,
): FormElementState<T> {
  const valueUnit = makePrimaryUnit<T>(initialValue);
  const errorUnit = makePrimaryUnit<Translations | null>(null);
  const isValidUnit = makeDerivedUnit(errorUnit).getUnit(err => err === null);
  const visitedUnit = makePrimaryUnit<boolean>(false);

  return {
    kind: 'form-element-state',
    units: {
      value: valueUnit,
      isValid: isValidUnit,
      error: errorUnit,
      visited: visitedUnit,
    },
    useMethods: () => {
      const [getValueState, setValue] = [
        valueUnit.useGetState(),
        valueUnit.useSetState(),
      ];
      const setError = errorUnit.useSetState();
      const [visited, setVisited] = [
        visitedUnit.useState(),
        visitedUnit.useSetState(),
      ];

      const validateValue = useCallback(
        (value: T, validator: Validator<T>): boolean => {
          const validationResult = validator.validate(value);

          if (validationResult.kind === 'invalid') {
            setError(validationResult.message);
            return false;
          }

          if (validationResult.kind === 'valid') {
            setError(null);
          }

          return true;
        },
        [setError],
      );

      const changeValue = useCallback(
        (newValue: T) => {
          setValue(newValue);
          if (validator && visited) {
            validateValue(newValue, validator);
          }
        },
        [setValue, validateValue, visited],
      );

      const changeVisited = useCallback(
        (newValue: boolean) => {
          setVisited(newValue);
          if (newValue && validator) {
            validateValue(getValueState(), validator);
          }
        },
        [getValueState, setVisited, validateValue],
      );

      const validate = useCallback((): boolean => {
        if (validator) {
          const value = getValueState();
          return validateValue(value, validator);
        }

        return true;
      }, [getValueState, validateValue]);

      return {
        changeValue,
        changeVisited,
        validate,
      };
    },
    ContextProvider: composeContextProviders(
      valueUnit.ContextProvider,
      errorUnit.ContextProvider,
      isValidUnit.ContextProvider,
      visitedUnit.ContextProvider,
    ),
  };
}
