import React from 'react';

export function composeContextProviders(
  ...providers: React.ComponentType[]
): React.ComponentType {
  return ({ children }: React.PropsWithChildren<{}>) =>
    providers.reduce((acc, X) => <X>{acc}</X>, <>{children}</>);
}
