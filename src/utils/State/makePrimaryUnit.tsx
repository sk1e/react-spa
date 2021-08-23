import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '../react/RequiredContext';
import { getNewState } from './getNewState';
import {
  StateSubscriber,
  SubscribeContextData,
  PrimaryStateUnit,
  StateUnitWriteContextData,
} from './types';

type PrivateContextData<T> = {
  getState(): T;
} & StateUnitWriteContextData<T>;

export function makePrimaryUnit<T>(initialState: T): PrimaryStateUnit<T> {
  const PrivateStateContext = createRequiredContext<PrivateContextData<T>>();

  const SubscribeContext = createRequiredContext<SubscribeContextData<T>>();

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const state = useRef<T>(initialState);
    const subscribers = useRef<Array<StateSubscriber<T>>>([]);

    const subscribe = useCallback((subscriber: StateSubscriber<T>) => {
      subscribers.current.push(subscriber);

      return () => {
        subscribers.current = subscribers.current.filter(x => x !== subscriber);
      };
    }, []);

    const setState = (value: React.SetStateAction<T>) => {
      state.current = getNewState(value, state.current);
      subscribers.current.forEach(f => f(state.current));
    };

    const getState = () => state.current;

    return (
      <SubscribeContext.Provider subscribe={subscribe}>
        <PrivateStateContext.Provider getState={getState} setState={setState}>
          {children}
        </PrivateStateContext.Provider>
      </SubscribeContext.Provider>
    );
  }

  return {
    initialState,
    SubscribeContext,
    useState: () => {
      const { subscribe } = useRequiredContext(SubscribeContext);
      const { getState } = useRequiredContext(PrivateStateContext);

      const [state, setState] = useState<T>(getState);

      useEffect(
        () =>
          subscribe(s => {
            setState(s);
          }),
        [subscribe],
      );

      return state;
    },
    useSetState: () => {
      return useRequiredContext(PrivateStateContext).setState;
    },
    useGetState: () => {
      return useRequiredContext(PrivateStateContext).getState;
    },
    ContextProvider,
  };
}
