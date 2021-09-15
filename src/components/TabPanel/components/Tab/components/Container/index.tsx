import React, { useCallback, useRef, useState } from 'react';

import { makeDerivedUnit, makeUnitStore } from 'utils/State';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';
import { withContextProviders } from 'utils/react';
import { useRequiredContext } from 'utils/react/RequiredContext';
import { useBrowserLayoutEffect } from 'utils/useBrowserLayoutEffect';

import * as Ripple from './Ripple';
import { DependenciesContext } from './dependenciesContext';
import './style.scss';

export { DependenciesContext } from './dependenciesContext';

const b = block('tab-container');

type Props = {};

type RippleAnimation = {
  positionStyle: Ripple.PositionStyle;
  id: string;
};

const rippleStateStore = makeUnitStore<Ripple.State>();

const allAnimationsAreCompletedUnit = makeDerivedUnit(rippleStateStore).getUnit(
  animations => Object.values(animations).every(x => x === 'finished'),
);

const numbers = naturalNumbers();

function Container({ children }: React.PropsWithChildren<Props>) {
  const { isActive, setActiveTab, tab } =
    useRequiredContext(DependenciesContext);

  const handleTabClick = useCallback(() => {
    setActiveTab(tab);
  }, [setActiveTab, tab]);

  const [rippleAnimations, setRippleAnimations] = useState<RippleAnimation[]>(
    [],
  );
  const allAnimationsAreCompleted = allAnimationsAreCompletedUnit.useState();
  const setRippleStateStoreValue = rippleStateStore.useSetState();

  useBrowserLayoutEffect(() => {
    // NOTE ripple animation node should not be detached when mouse button was pressed but not released,
    // otherwise click event will not be dispatched after mouse release.
    // All animations become completed outside of this range of time, so we can safely unmount them here
    if (allAnimationsAreCompleted) {
      setRippleAnimations([]);
      setRippleStateStoreValue({});
    }
  }, [allAnimationsAreCompleted, setRippleStateStoreValue]);

  const rippleStateStoreMethods = rippleStateStore.useMethods();

  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const { left, top } = rect;

        const id = numbers.next().value.toString();

        rippleStateStoreMethods.addUnit(id, 'active');
        setRippleAnimations(prev => [
          ...prev,
          {
            id,
            positionStyle: {
              left: `${e.clientX - left}px`,
              top: `${e.clientY - top}px`,
            },
          },
        ]);
      }
    },
    [rippleStateStoreMethods],
  );

  return (
    <div
      ref={ref}
      className={b({ active: isActive })}
      onClick={handleTabClick}
      onMouseDown={handleMouseDown}
    >
      {rippleAnimations.map(a => (
        <Ripple.Component
          positionStyle={a.positionStyle}
          key={a.id}
          unit={rippleStateStoreMethods.getUnit(a.id)}
        />
      ))}
      {children}
    </div>
  );
}

export const DefaultComponent = withContextProviders(Container, [
  rippleStateStore.ContextProvider,
]);
