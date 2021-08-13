import React from 'react';

import { RequiredContext } from '../RequiredContext';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type StateSubscriber<T> = (state: T) => void;

export type SubscribeContextData<T> = {
  subscribe(subscriber: StateSubscriber<T>): void;
};

export type StateUnitWriteContextData<T> = {
  setState(state: React.SetStateAction<T>): void;
};

export type StateUnit<T> = {
  useState(): T;
  initialState: T;
  ContextProvider: React.ComponentType;
  SubscribeContext: RequiredContext<SubscribeContextData<T>>;
};

export type RenderInterface<T> = {
  useState(): T;
  useSetState(): SetState<T>;
};

export type PrimaryStateUnit<T> = StateUnit<T> & {
  useSetState(): SetState<T>;
};

export type ID = string | number;

type StoreMethods<T> = {
  addUnit(id: ID, initialState: T): void;
  getUnit(id: ID): RenderInterface<T>;
};

export type UnitStore<T> = PrimaryStateUnit<Record<ID, T>> & {
  useMethods(): StoreMethods<T>;
};
