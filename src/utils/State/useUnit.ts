import { SetState, UnitRenderInterface } from './types';

export function useUnit<T>({
  useSetState,
  useState,
}: UnitRenderInterface<T>): [T, SetState<T>] {
  return [useState(), useSetState()];
}
