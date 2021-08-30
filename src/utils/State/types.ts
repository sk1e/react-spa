import React from 'react';

export type SetState<T> = (arg: SetStateArg<T>) => void;
export type SetStateArg<T> = React.SetStateAction<T>;

export type StateSubscriber<T> = (state: T) => void;
export type GenericStateSubscriber<T> = (state: T, id: string) => void;

export type SubscriberAdder<T> = (
  subscribers: Array<GenericStateSubscriber<T>>,
) => void;

export type StateUnitWriteContextData<T> = {
  setState(state: React.SetStateAction<T>): void;
};

export type AbstractStateUnit<T> = {
  addSubscriber(subscriber: GenericStateSubscriber<T>): void;
  useState(): T;
  useGetState(): () => T;
  initialState: T;
  useID(): string;
};

export type DerivedStateUnit<T> = AbstractStateUnit<T> & {
  kind: 'derived';
  useInitializers(): Array<() => void>;
};

export type StateUnit<T> = DerivedStateUnit<T> | PrimaryStateUnit<T>;

export type UnitRenderInterface<T> = {
  useState(): T;
  useSetState(): SetState<T>;
};

export type PrimaryStateUnit<T> = AbstractStateUnit<T> & {
  kind: 'primary';
  ContextProvider: React.ComponentType;
  useSetState(): SetState<T>;
};

export type SubscribeContextData<T> = {
  subscribe(subscriber: StateSubscriber<T>): () => void;
};

export type ID = string;

type StoreMethods<T> = {
  addUnit(id: ID, initialState: T): void;
  getUnit(id: ID): UnitRenderInterface<T>;
};

export type UnitStore<T> = PrimaryStateUnit<Record<ID, T>> & {
  useMethods(): StoreMethods<T>;
};
