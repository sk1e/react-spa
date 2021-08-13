import React, { useEffect, useRef, useState } from 'react';

import { createRequiredContext, useRequiredContext } from '../RequiredContext';
import { getNewState } from './getNewState';
import {
  StateSubscriber,
  SubscribeContextData,
  PrimaryStateUnit,
  StateUnitWriteContextData,
} from './types';

export function makePrimaryUnit<T>(initialState: T): PrimaryStateUnit<T> {
  const PrivateStateContext =
    createRequiredContext<StateUnitWriteContextData<T>>();

  const SubscribeContext = createRequiredContext<SubscribeContextData<T>>();

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const state = useRef<T>(initialState);
    const subscribers = useRef<Array<StateSubscriber<T>>>([]);

    const subscribe = (subscriber: StateSubscriber<T>) => {
      subscribers.current.push(subscriber);

      return () => {
        subscribers.current = subscribers.current.filter(x => x !== subscriber);
      };
    };

    const setState = (value: React.SetStateAction<T>) => {
      state.current = getNewState(value, state.current);
      subscribers.current.forEach(f => f(state.current));
    };

    return (
      <SubscribeContext.Provider value={{ subscribe }}>
        <PrivateStateContext.Provider value={{ setState }}>
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

      const [state, setState] = useState<T>(initialState);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => subscribe(s => setState(s)), []);

      return state;
    },
    useSetState: () => {
      return useRequiredContext(PrivateStateContext).setState;
    },
    ContextProvider,
  };
}
