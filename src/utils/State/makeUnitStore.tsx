import { useEffect, useRef, useState } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '../react/RequiredContext';
import { getNewState } from './getNewState';
import {
  ID,
  SubscribeContextData,
  UnitStore,
  StateUnitWriteContextData,
  UnitRenderInterface,
} from './types';

type StoreSubscriber<T> = (state: Record<ID, T>) => void;
type InstanceSubscriber<T> = (state: T) => void;

type StoreData<T> = StateUnitWriteContextData<Record<ID, T>> & {
  addUnit(id: ID, initialState: T): void;
  getUnit(id: ID): UnitRenderInterface<T>;
};

export function makeUnitStore<T>(): UnitStore<T> {
  const StoreContext = createRequiredContext<StoreData<T>>();
  const SubscribeContext =
    createRequiredContext<SubscribeContextData<Record<ID, T>>>();

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const storeState = useRef<Record<ID, T>>({});
    const unitSubscribers = useRef<Record<ID, Array<InstanceSubscriber<T>>>>(
      {},
    );
    const storeSubscribers = useRef<Array<StoreSubscriber<T>>>([]);

    const subscribeStore = (subscriber: StoreSubscriber<T>): (() => void) => {
      storeSubscribers.current.push(subscriber);

      return () => {
        storeSubscribers.current = storeSubscribers.current.filter(
          x => x !== subscriber,
        );
      };
    };

    const subscribeUnit = (
      id: ID,
      handler: (state: T) => void,
    ): (() => void) => {
      unitSubscribers.current[id].push(handler);

      return () => {
        unitSubscribers.current = {
          ...unitSubscribers.current,
          [id]: unitSubscribers.current[id].filter(x => x !== handler),
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
        unitSubscribers.current[prop].forEach(f => f(newState[prop])),
      );
    };

    const getUnit = (id: ID): UnitRenderInterface<T> => {
      return {
        useState: () => {
          const [state, setState] = useState(storeState.current[id]);

          useEffect(() => subscribeUnit(id, s => setState(s)), []);

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
      unitSubscribers.current[id] = [];
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
      const { subscribe } = useRequiredContext(SubscribeContext);

      const [state, setState] = useState<Record<ID, T>>({});

      useEffect(() => subscribe(s => setState(s)), [subscribe]);

      return state;
    },
    useSetState: () => {
      return useRequiredContext(StoreContext).setState;
    },
    ContextProvider,
    useMethods: () => {
      const { addUnit, getUnit } = useRequiredContext(StoreContext);

      return {
        addUnit,
        getUnit,
      };
    },
    useGetState: () => (): Record<string, T> => {
      // TODO implement
      throw new Error('not implemented');
    },
  };
}
