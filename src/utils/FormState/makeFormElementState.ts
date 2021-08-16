import { useCallback } from 'react';

import { Translations, Validator } from 'types';
import { makePrimaryUnit, makeDerivedUnit } from 'utils/State';

import { makeComponentOfNestedComponents } from '../react/makeComponentOfNestedComponents';
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
        (value: T, validator: Validator<T>) => {
          const validationResult = validator.validate(value);

          if (validationResult.kind === 'invalid') {
            setError(validationResult.message);
          } else if (validationResult.kind === 'valid') {
            setError(null);
          }
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

      return {
        changeValue,
        changeVisited,
      };
    },
    ContextProvider: makeComponentOfNestedComponents(
      valueUnit.ContextProvider,
      errorUnit.ContextProvider,
      isValidUnit.ContextProvider,
      visitedUnit.ContextProvider,
    ),
  };
}
