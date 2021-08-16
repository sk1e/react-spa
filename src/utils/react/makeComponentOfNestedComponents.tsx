import React from 'react';

export function makeComponentOfNestedComponents(
  ...components: React.ComponentType[]
): React.ComponentType {
  return ({ children }: React.PropsWithChildren<{}>) =>
    components.reduce((acc, X) => <X>{acc}</X>, <>{children}</>);
}
