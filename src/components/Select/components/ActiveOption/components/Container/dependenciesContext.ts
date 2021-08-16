import { createRequiredContext } from 'utils/react/RequiredContext';

export const DependenciesContext = createRequiredContext<Dependencies>();

type Dependencies = {
  onClick(e: React.MouseEvent): void;
};
