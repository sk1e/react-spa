import { createContext, useContext } from 'react';

const uninitializedContextData = Symbol('uninitialized');

export type Uninitialized = typeof uninitializedContextData;

export function createRequiredContext<T>() {
  return createContext<T | Uninitialized>(uninitializedContextData);
}

export function useRequiredContext<T>(
  Context: React.Context<T | Uninitialized>,
): T {
  const contextData = useContext(Context);

  if (contextData === uninitializedContextData) {
    throw Error('uninitialized context data');
  }

  return contextData;
}
