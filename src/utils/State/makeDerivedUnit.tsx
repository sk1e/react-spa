import * as R from 'ramda';
import { useEffect, useRef, useState } from 'react';

import { createRequiredContext, useRequiredContext } from '../RequiredContext';
import { StateSubscriber, StateUnit, SubscribeContextData } from './types';

type StateTypes<T, Acc extends Array<unknown> = []> = T extends []
  ? Acc
  : T extends [StateUnit<infer State>, ...infer XS]
  ? StateTypes<XS, [...Acc, State]>
  : never;

type DependencyConfig<T extends Array<unknown>> = {
  getUnit<R>(deriver: (...args: StateTypes<T>) => R): StateUnit<R>;
};

export function makeDerivedUnit<T extends Array<unknown>>(
  ...stateUnits: T
): DependencyConfig<T> {
  return {
    getUnit<R>(deriver: (...args: StateTypes<T>) => R): StateUnit<R> {
      const unitsInitialState = (stateUnits as Array<StateUnit<unknown>>).map(
        x => x.initialState,
      );
      const initialState = deriver(...(unitsInitialState as StateTypes<T>));

      const SubscribeContext = createRequiredContext<SubscribeContextData<R>>();

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
          <SubscribeContext.Provider value={{ subscribe }}>
            {children}
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

          const contextsData = (stateUnits as Array<StateUnit<unknown>>)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            .map(x => useRequiredContext(x.SubscribeContext));

          useEffect(() => {
            contextsData.forEach((x, index) =>
              x.subscribe(state => {
                setDependencies(prev => R.update(index, state, prev));
              }),
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          return deriver(...(dependencies as StateTypes<T>));
        },
      };
    },
  };
}
