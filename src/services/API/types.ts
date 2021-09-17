import React from 'react';

export type CallState<T> =
  | InitialState
  | PendingState
  | ErrorState
  | SuccessfulState<T>;

export type DataComponentConfigurator<T> = {
  onSuccess(
    makePendingComponent: (data: T) => React.ReactNode,
  ): DataComponentConfigurator<T>;
  onPending?(
    makePendingComponent: () => React.ReactNode,
  ): DataComponentConfigurator<T>;
  getComponent(): React.ComponentType;
};

type InitialState = {
  kind: 'initial';
};

type PendingState = {
  kind: 'pending';
};

type ErrorState = {
  kind: 'error';
  message: string;
};

type SuccessfulState<T> = {
  kind: 'successful';
  data: T;
};
