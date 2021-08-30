import { createRequiredContext } from 'utils/react/RequiredContext';

type InstanceContext = {
  name: string;
};

export function makeInstance() {
  return createRequiredContext<InstanceContext>();
}
