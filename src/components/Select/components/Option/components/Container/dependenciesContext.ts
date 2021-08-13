import { createRequiredContext } from 'utils/RequiredContext';
import { SetState } from 'utils/State';

type Dependencies<T> = {
  setActiveOption: SetState<T>;
  setSelectIsExpanded: SetState<boolean>;
  option: T;
  isActive: boolean;
};

export const DependenciesContext = createRequiredContext<Dependencies<any>>();
