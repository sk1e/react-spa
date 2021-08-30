import { useEffect, useState } from 'react';

import { makeLogger } from '../Logger';
import {
  GenericStateSubscriber,
  StateSubscriber,
  AbstractStateUnit,
  DerivedStateUnit,
  StateUnit,
} from './types';

type StateTypes<T, Acc extends Array<unknown> = []> = T extends []
  ? Acc
  : T extends [AbstractStateUnit<infer State>, ...infer XS]
  ? StateTypes<XS, [...Acc, State]>
  : T extends Array<AbstractStateUnit<infer State>>
  ? State[]
  : never;

type DependencyConfig<T extends Array<unknown>> = {
  getUnit<R>(
    deriver: (...args: StateTypes<T>) => R,
    name?: string,
  ): DerivedStateUnit<R>;
};

export function makeDerivedUnit<T extends Array<unknown>>(
  ...stateUnits: T
): DependencyConfig<T> {
  return {
    getUnit<R>(
      deriver: (...args: StateTypes<T>) => R,
      name?: string,
    ): DerivedStateUnit<R> {
      const log = makeLogger(name);

      const getDerivedUnitID = (unitIDs: string[]) => unitIDs.join(':');

      const statesToDerive: Array<Record<string, any>> = stateUnits.map(
        () => ({}),
      );

      const unitSubscribers: Array<
        Record<string, Array<StateSubscriber<unknown>>>
      > = stateUnits.map(() => ({}));

      (stateUnits as Array<AbstractStateUnit<unknown>>).forEach(
        (unit, index) => {
          unit.addSubscriber((state, id) => {
            log('received new state from unit', state, id);
            statesToDerive[index][id] = state;
            unitSubscribers[index][id]?.forEach(f => f(state));
          });
        },
      );

      const derivedUnitSubscribers: Record<
        string,
        Array<StateSubscriber<R>>
      > = {};
      const derivedUnitGenericSubscribers: Array<GenericStateSubscriber<R>> =
        [];

      const unitsInitialState = (
        stateUnits as Array<AbstractStateUnit<unknown>>
      ).map(x => x.initialState);

      const initialState = deriver(...(unitsInitialState as StateTypes<T>));

      const derivedUnitIDToDerivedState: Record<string, R> = {};

      const initDerivedUnitSubscribers = (unitIDs: string[]) => {
        const derivedUnitID = unitIDs.join(':');
        // log('initialize derived unit stream', derivedUnitID);

        const derivableStates = unitsInitialState;

        unitIDs.forEach((unitID, index) => {
          const unitSubscriber = (state: unknown) => {
            derivableStates[index] = state;
            const derivedState = deriver(...(derivableStates as StateTypes<T>));
            derivedUnitIDToDerivedState[derivedUnitID] = derivedState;
            derivedUnitSubscribers[derivedUnitID]?.forEach(f =>
              f(derivedState),
            );
            derivedUnitGenericSubscribers.forEach(f =>
              f(derivedState, derivedUnitID),
            );
          };

          if (unitSubscribers[index][unitID] === undefined) {
            unitSubscribers[index][unitID] = [unitSubscriber];
          } else {
            unitSubscribers[index][unitID].push(unitSubscriber);
          }
        });
      };

      const subscribe = (unitIDs: string[], subscriber: StateSubscriber<R>) => {
        const derivedUnitID = getDerivedUnitID(unitIDs);

        if (derivedUnitSubscribers[derivedUnitID] !== undefined) {
          derivedUnitSubscribers[derivedUnitID].push(subscriber);
        } else {
          derivedUnitSubscribers[derivedUnitID] = [subscriber];
        }

        return () => {
          derivedUnitSubscribers[derivedUnitID] = derivedUnitSubscribers[
            derivedUnitID
          ].filter(x => x !== subscriber);
        };
      };

      const addGenericSubscriber = (subscriber: GenericStateSubscriber<R>) => {
        derivedUnitGenericSubscribers.push(subscriber);
      };

      const makeInitializer = (unitIDs: string[]) => {
        const derivedUnitID = unitIDs.join(':');

        return () => {
          if (derivedUnitSubscribers[derivedUnitID] === undefined) {
            initDerivedUnitSubscribers(unitIDs);
          }
        };
      };

      const useInitializers = () => {
        const ids = (stateUnits as Array<AbstractStateUnit<any>>).map(x =>
          x.useID(),
        );
        const initializers = (stateUnits as Array<StateUnit<unknown>>)
          .filter<DerivedStateUnit<unknown>>(
            (x): x is DerivedStateUnit<unknown> => x.kind === 'derived',
          )
          .flatMap(x => x.useInitializers());

        return [makeInitializer(ids), ...initializers];
      };

      const useID = () => {
        return (stateUnits as Array<AbstractStateUnit<unknown>>)
          .map(x => x.useID())
          .join(':');
      };

      return {
        kind: 'derived',
        addSubscriber: addGenericSubscriber,
        useID,
        useInitializers,
        initialState,
        useState: () => {
          const [state, setState] = useState(initialState);
          const initializers = useInitializers();

          const stateUnitsIDs = (
            stateUnits as Array<AbstractStateUnit<unknown>>
          ).map(x => x.useID());

          useEffect(() => {
            initializers.forEach(f => f());

            return subscribe(stateUnitsIDs, setState);
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          return state;
        },
        useGetState: (): (() => R) => {
          const id = useID();
          return () =>
            derivedUnitIDToDerivedState[id] === undefined
              ? initialState
              : derivedUnitIDToDerivedState[id];
        },
      };
    },
  };
}
