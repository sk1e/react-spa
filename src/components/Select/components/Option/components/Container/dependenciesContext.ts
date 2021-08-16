import { SetState } from 'utils/State';
import { createRequiredContext } from 'utils/react/RequiredContext';

type Dependencies<T> = {
  setActiveOption: SetState<T>;
  setSelectIsExpanded: SetState<boolean>;
  option: T;
  isActive: boolean;
};

export const DependenciesContext = createRequiredContext<Dependencies<any>>();
