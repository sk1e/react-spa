import { Translations } from 'types';
import { PrimaryStateUnit, StateUnit } from 'utils/State';

export type FormElementState<T> = {
  kind: 'form-element-state';
  units: {
    value: PrimaryStateUnit<T>;
    isValid: StateUnit<boolean>;
    error: PrimaryStateUnit<Translations | null>;
    visited: PrimaryStateUnit<boolean>;
  };
  ContextProvider: React.ComponentType;
  useMethods(): {
    changeValue(newValue: T): void;
    changeVisited(newValue: boolean): void;
    validate(): boolean;
  };
};
