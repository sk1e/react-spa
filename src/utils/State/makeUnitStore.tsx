import { useEffect, useMemo, useRef, useState } from 'react';

import { naturalNumbers } from 'utils/math';

import {
  createRequiredContext,
  useRequiredContext,
} from '../react/RequiredContext';
import { getNewState } from './getNewState';
import {
  ID,
  UnitStore,
  StateUnitWriteContextData,
  UnitRenderInterface,
  SubscribeContextData,
  GenericStateSubscriber,
} from './types';

type StoreSubscriber<T> = (state: Record<ID, T>) => void;
type InstanceSubscriber<T> = (state: T) => void;

type StoreData<T> = StateUnitWriteContextData<Record<ID, T>> &
  SubscribeContextData<Record<ID, T>> & {
    id: string;
    addUnit(id: ID, initialState: T): void;
    getUnit(id: ID): UnitRenderInterface<T>;
  };

const numbers = naturalNumbers();

export function makeUnitStore<T>(): UnitStore<T> {
  const StoreContext = createRequiredContext<StoreData<T>>();

  const genericSubscribers: Array<GenericStateSubscriber<Record<ID, T>>> = [];

  const addGenericSubscriber = (
    subscriber: GenericStateSubscriber<Record<ID, T>>,
  ) => {
    genericSubscribers.push(subscriber);
  };

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const storeState = useRef<Record<ID, T>>({});
    const unitSubscribers = useRef<Record<ID, Array<InstanceSubscriber<T>>>>(
      {},
    );
    const storeSubscribers = useRef<Array<StoreSubscriber<T>>>([]);

    const id = useMemo(() => numbers.next().value.toString(), []);

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
      const newState = getNewState(value, storeState.current);
      storeState.current = newState;
      storeSubscribers.current.forEach(f => f(newState));
      genericSubscribers.forEach(f => f(newState, id));
    };

    const setStoreStatePublic = (
      value: React.SetStateAction<Record<ID, T>>,
    ) => {
      const newState = getNewState(value, storeState.current);

      const updatedProperties = Object.entries(storeState.current)
        .filter(
          ([key, value]) =>
            newState[key] !== value && newState[key] !== undefined,
        )
        .map(([key]) => key);

      storeState.current = newState;

      storeSubscribers.current.forEach(f => f(newState));
      genericSubscribers.forEach(f => f(newState, id));
      updatedProperties.forEach(prop =>
        unitSubscribers.current[prop].forEach(f => f(newState[prop])),
      );
    };

    const getUnit = (id: ID): UnitRenderInterface<T> => {
      return {
        useState: () => {
          const [state, setState] = useState(storeState.current[id]);

          useEffect(
            () =>
              subscribeUnit(id, s => {
                setState(s);
              }),
            [],
          );

          return state;
        },
        useSetState: () => (value: React.SetStateAction<T>) => {
          const newState = getNewState(value, storeState.current[id]);

          setStoreState(prev => ({
            ...prev,
            [id]: newState,
          }));

          unitSubscribers.current[id].forEach(f => f(newState));
        },
      };
    };

    const addUnit = (id: ID, initialState: T): void => {
      unitSubscribers.current[id] = [];
      setStoreState(prev => ({ ...prev, [id]: initialState }));
    };

    return (
      <StoreContext.Provider
        subscribe={subscribeStore}
        addUnit={addUnit}
        getUnit={getUnit}
        setState={setStoreStatePublic}
        id={id}
      >
        {children}
      </StoreContext.Provider>
    );
  }

  return {
    kind: 'primary',
    addSubscriber: addGenericSubscriber,
    useID: () => {
      return useRequiredContext(StoreContext).id;
    },
    initialState: {},
    useState: () => {
      const { subscribe } = useRequiredContext(StoreContext);

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
