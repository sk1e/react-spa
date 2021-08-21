import { createRequiredContext } from 'utils/react/RequiredContext';

type Dependencies = {
  isActive: boolean;
};

export const DependenciesContext = createRequiredContext<Dependencies>();
