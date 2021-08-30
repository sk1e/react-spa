import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { naturalNumbers } from 'utils/math';

import {
  createRequiredContext,
  useRequiredContext,
} from '../react/RequiredContext';
import { getNewState } from './getNewState';
import {
  StateSubscriber,
  PrimaryStateUnit,
  StateUnitWriteContextData,
  GenericStateSubscriber,
} from './types';

type PrivateContextData<T> = {
  subscribe(handler: (state: T) => void): () => void;
  getState(): T;
  id: string;
} & StateUnitWriteContextData<T>;

const numbers = naturalNumbers();

export function makePrimaryUnit<T>(initialState: T): PrimaryStateUnit<T> {
  const PrivateStateContext = createRequiredContext<PrivateContextData<T>>();

  const genericSubscribers: Array<GenericStateSubscriber<T>> = [];

  const addGenericSubscriber = (subscriber: GenericStateSubscriber<T>) => {
    genericSubscribers.push(subscriber);
  };

  function ContextProvider({ children }: React.PropsWithChildren<{}>) {
    const state = useRef<T>(initialState);
    const subscribers = useRef<Array<StateSubscriber<T>>>([]);
    const id = useMemo(() => numbers.next().value.toString(), []);

    const subscribe = useCallback((subscriber: StateSubscriber<T>) => {
      subscribers.current.push(subscriber);

      return () => {
        subscribers.current = subscribers.current.filter(x => x !== subscriber);
      };
    }, []);

    const setState = (value: React.SetStateAction<T>) => {
      const newState = getNewState(value, state.current);
      state.current = newState;
      subscribers.current.forEach(f => f(newState));
      genericSubscribers.forEach(f => f(newState, id));
    };

    const getState = () => state.current;

    return (
      <PrivateStateContext.Provider
        getState={getState}
        setState={setState}
        subscribe={subscribe}
        id={id}
      >
        {children}
      </PrivateStateContext.Provider>
    );
  }

  return {
    kind: 'primary',
    initialState,
    useState: () => {
      const { getState, subscribe } = useRequiredContext(PrivateStateContext);

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
    addSubscriber: addGenericSubscriber,
    useID: () => {
      return useRequiredContext(PrivateStateContext).id;
    },
  };
}
