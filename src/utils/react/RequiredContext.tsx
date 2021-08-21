import React from 'react';
import { createContext, useContext } from 'react';

const uninitializedContextData = Symbol('uninitialized');

export type Uninitialized = typeof uninitializedContextData;

export type RequiredContext<T extends Record<string, any>> = React.Context<
  T | Uninitialized
>;

export type CustomContext<T extends Record<string, any>> = {
  context: React.Context<T | Uninitialized>;
  Provider: React.MemoExoticComponent<React.FunctionComponent<T>>;
};

export function createRequiredContext<
  T extends Record<string, any>,
>(): CustomContext<T> {
  const context = createContext<T | Uninitialized>(uninitializedContextData);

  return {
    context,
    Provider: React.memo(
      ({ children, ...value }: React.PropsWithChildren<T>) => (
        <context.Provider value={value as any}>{children}</context.Provider>
      ),
    ),
  };
}

export function useRequiredContext<T extends Record<string, any>>(
  Context: CustomContext<T>,
): T {
  const contextData = useContext(Context.context);

  if (contextData === uninitializedContextData) {
    throw Error('uninitialized context data');
  }

  return contextData;
}
