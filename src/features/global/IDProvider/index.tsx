import React, { useCallback, useRef } from 'react';

import { naturalNumbers } from 'utils/math';
import {
  createRequiredContext,
  useRequiredContext,
} from 'utils/react/RequiredContext';

type IDProviderData = {
  getID(entity: string): string;
};

const Context = createRequiredContext<IDProviderData>();

type Props = {};

function IDProvider({ children }: React.PropsWithChildren<Props>) {
  const entityToNumbersGenerator = useRef<
    Record<string, Generator<number, number, unknown>>
  >({});

  const getID = useCallback((entity: string) => {
    if (entityToNumbersGenerator.current[entity] === undefined) {
      entityToNumbersGenerator.current[entity] = naturalNumbers();
    }

    return entityToNumbersGenerator.current[entity].next().value.toString();
  }, []);

  return <Context.Provider getID={getID}>{children}</Context.Provider>;
}

export const Component = React.memo(IDProvider) as typeof IDProvider;

export function useID(entity: string): string {
  return useRequiredContext(Context).getID(entity);
}
