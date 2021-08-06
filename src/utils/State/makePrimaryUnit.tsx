import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getNewState } from './getNewState';
import {
  StateSubscriber,
  SubscribeContextData,
  PrimaryStateUnit,
  StateUnitWriteContextData,
} from './types';

export function makePrimaryUnit<T>(initialState: T): PrimaryStateUnit<T> {
  const PrivateStateContext = createContext<StateUnitWriteContextData<T>>(
    null as any,
  );

  const SubscribeContext = createContext<SubscribeContextData<T>>(null as any);

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
      const { subscribe } = useContext(SubscribeContext);

      const [state, setState] = useState<T>(initialState);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => subscribe(s => setState(s)), []);

      return state;
    },
    useSetState: () => {
      return useContext(PrivateStateContext).setState;
    },
    ContextProvider,
  };
}
