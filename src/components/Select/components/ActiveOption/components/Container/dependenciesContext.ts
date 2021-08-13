import { createRequiredContext } from 'utils/RequiredContext';

export const DependenciesContext = createRequiredContext<Dependencies>();

type Dependencies = {
  onClick(e: React.MouseEvent): void;
};
