import React from 'react';

import { CustomContext } from '../react/RequiredContext';

export type SetState<T> = (arg: SetStateArg<T>) => void;
export type SetStateArg<T> = React.SetStateAction<T>;

export type StateSubscriber<T> = (state: T) => void;

export type SubscribeContextData<T> = {
  subscribe(subscriber: StateSubscriber<T>): void;
};

export type StateUnitWriteContextData<T> = {
  setState(state: React.SetStateAction<T>): void;
};

export type StateUnit<T> = {
  useState(): T;
  useGetState(): () => T;
  initialState: T;
  ContextProvider: React.ComponentType;
  SubscribeContext: CustomContext<SubscribeContextData<T>>;
};

export type UnitRenderInterface<T> = {
  useState(): T;
  useSetState(): SetState<T>;
};

export type PrimaryStateUnit<T> = StateUnit<T> & {
  useSetState(): SetState<T>;
};

export type ID = string;

type StoreMethods<T> = {
  addUnit(id: ID, initialState: T): void;
  getUnit(id: ID): UnitRenderInterface<T>;
};

export type UnitStore<T> = PrimaryStateUnit<Record<ID, T>> & {
  useMethods(): StoreMethods<T>;
};
