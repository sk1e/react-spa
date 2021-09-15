/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect } from 'react';

export function useBrowserLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  if (typeof window === undefined) {
    return;
  }

  useLayoutEffect(effect, deps);
}
