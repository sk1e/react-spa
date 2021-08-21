import { SetState } from 'utils/State';
import { createRequiredContext } from 'utils/react/RequiredContext';

type Dependencies<T> = {
  setActiveTab: SetState<T>;
  tab: T;
  isActive: boolean;
};

export const DependenciesContext = createRequiredContext<Dependencies<any>>();
