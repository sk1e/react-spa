import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { getNewState } from './getNewState';
import {
  ID,
  SubscribeContextData,
  Store,
  StateUnitWriteContextData,
  RenderInterface,
} from './types';

type StoreSubscriber<T> = (state: Record<ID, T>) => void;
type InstanceSubscriber<T> = (state: T) => void;

type StoreData<T> = StateUnitWriteContextData<Record<ID, T>> & {
  addUnit(id: ID, initialState: T): void;
  getUnit(id: ID): RenderInterface<T>;
};

export function makeUnitManager<T>(): Store<T> {
  const StoreContext = createContext<StoreData<T>>(null as any);
  const SubscribeContext = createContext<SubscribeContextData<Record<ID, T>>>(
    null as any,
  );

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const storeState = useRef<Record<ID, T>>({});
    const instanceSubscribers = useRef<
      Record<ID, Array<InstanceSubscriber<T>>>
    >({});
    const storeSubscribers = useRef<Array<StoreSubscriber<T>>>([]);

    const subscribeStore = (subscriber: StoreSubscriber<T>): (() => void) => {
      storeSubscribers.current.push(subscriber);

      return () => {
        storeSubscribers.current = storeSubscribers.current.filter(
          x => x !== subscriber,
        );
      };
    };

    const subscribeInstance = (
      id: ID,
      handler: (state: T) => void,
    ): (() => void) => {
      instanceSubscribers.current[id].push(handler);

      return () => {
        instanceSubscribers.current = {
          ...instanceSubscribers.current,
          [id]: instanceSubscribers.current[id].filter(x => x !== handler),
        };
      };
    };

    const setStoreState = (value: React.SetStateAction<Record<ID, T>>) => {
      storeState.current = getNewState(value, storeState.current);
      storeSubscribers.current.forEach(f => f(storeState.current));
    };

    const setStoreStatePublic = (
      value: React.SetStateAction<Record<ID, T>>,
    ) => {
      const newState = getNewState(value, storeState.current);

      const updatedProperties = Object.entries(storeState.current)
        .filter(([key, value]) => newState[key] !== value)
        .map(([key]) => key);

      storeState.current = newState;

      storeSubscribers.current.forEach(f => f(newState));
      updatedProperties.forEach(prop =>
        instanceSubscribers.current[prop].forEach(f => f(newState[prop])),
      );
    };

    const getUnit = (id: ID): RenderInterface<T> => {
      return {
        useState: () => {
          const [state, setState] = useState(storeState.current[id]);

          useEffect(() => subscribeInstance(id, s => setState(s)), []);

          return state;
        },
        useSetState: () => (value: React.SetStateAction<T>) =>
          setStoreState(prev => ({
            ...prev,
            [id]: getNewState(value, prev[id]),
          })),
      };
    };

    const addUnit = (id: ID, initialState: T): void => {
      instanceSubscribers.current[id] = [];
      setStoreState(prev => ({ ...prev, [id]: initialState }));
    };

    return (
      <SubscribeContext.Provider value={{ subscribe: subscribeStore }}>
        <StoreContext.Provider
          value={{
            addUnit,
            getUnit,
            setState: setStoreStatePublic,
          }}
        >
          {children}
        </StoreContext.Provider>
      </SubscribeContext.Provider>
    );
  }

  return {
    SubscribeContext,
    initialState: {},
    useState: () => {
      const { subscribe } = useContext(SubscribeContext);

      const [state, setState] = useState<Record<ID, T>>({});

      useEffect(() => subscribe(s => setState(s)), [subscribe]);

      return state;
    },
    useSetState: () => {
      return useContext(StoreContext).setState;
    },
    ContextProvider,
    useMethods: () => {
      const { addUnit, getUnit } = useContext(StoreContext);

      return {
        addUnit,
        getUnit,
      };
    },
  };
}
