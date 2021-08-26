import * as R from 'ramda';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  createRequiredContext,
  useRequiredContext,
} from '../react/RequiredContext';
import { StateSubscriber, StateUnit, SubscribeContextData } from './types';

type StateTypes<T, Acc extends Array<unknown> = []> = T extends []
  ? Acc
  : T extends [StateUnit<infer State>, ...infer XS]
  ? StateTypes<XS, [...Acc, State]>
  : T extends Array<StateUnit<infer State>>
  ? State[]
  : never;

type DependencyConfig<T extends Array<unknown>> = {
  getUnit<R>(
    deriver: (...args: StateTypes<T>) => R,
    name?: string,
  ): StateUnit<R>;
};

type PrivateContextData<T> = {
  subscribers: Array<StateSubscriber<T>>;
};

function makeLogger(name?: string) {
  return name
    ? (message: string, ...rest: any[]) =>
        console.log(`[${name}] ${message}`, ...rest)
    : () => void 0;
}

export function makeDerivedUnit<T extends Array<unknown>>(
  ...stateUnits: T
): DependencyConfig<T> {
  return {
    getUnit<R>(
      deriver: (...args: StateTypes<T>) => R,
      name?: string,
    ): StateUnit<R> {
      const log = makeLogger(name);

      const unitsInitialState = (stateUnits as Array<StateUnit<unknown>>).map(
        x => x.initialState,
      );
      const initialState = deriver(...(unitsInitialState as StateTypes<T>));

      const SubscribeContext = createRequiredContext<SubscribeContextData<R>>();
      const PrivateStateContext =
        createRequiredContext<PrivateContextData<any>>();

      const ContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
        const subscribers = useRef<Array<StateSubscriber<R>>>([]);

        const subscribe = (subscriber: StateSubscriber<R>) => {
          subscribers.current.push(subscriber);

          return () => {
            subscribers.current = subscribers.current.filter(
              x => x !== subscriber,
            );
          };
        };

        return (
          <SubscribeContext.Provider subscribe={subscribe}>
            <PrivateStateContext.Provider subscribers={subscribers.current}>
              {children}
            </PrivateStateContext.Provider>
          </SubscribeContext.Provider>
        );
      };

      return {
        ContextProvider,
        SubscribeContext,
        initialState,
        useState: () => {
          const [dependencies, setDependencies] =
            useState<any[]>(unitsInitialState);

          log('>> deps', name, dependencies);

          const contextsData = (stateUnits as Array<StateUnit<unknown>>)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            .map(x => useRequiredContext(x.SubscribeContext));

          const { subscribers } = useRequiredContext(PrivateStateContext);

          const state = useMemo(
            () => deriver(...(dependencies as StateTypes<T>)),
            [dependencies],
          );

          useEffect(() => {
            log('>> new state', name, state, subscribers);
            subscribers.forEach(f => f(state));
          }, [state, subscribers]);

          useEffect(() => {
            contextsData.forEach((x, index) => {
              return x.subscribe(state => {
                log('>> rec new state', name, state);
                setDependencies(prev => R.update(index, state, prev));
              });
            });
          }, [contextsData]);

          return state;
        },
        useGetState: () => (): R => {
          // TODO add ref to context, mutate it on useState, pass from ref here
          throw new Error('not implemented');
        },
      };
    },
  };
}
