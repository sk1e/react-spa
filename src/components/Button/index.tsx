import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { makeDerivedUnit, makeUnitManager } from 'utils/State';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';
import { withContextProviders } from 'utils/withContextProviders';

import { Ripple } from './components';
import './style.scss';

export type Size = 's' | 'm' | 'l';

const b = block('button');

type Props = {
  size?: Size;
  className?: string;
  variant?: 'primary' | 'secondary';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'classname' | 'type'> &
  { [K in 'type']-?: React.ButtonHTMLAttributes<HTMLButtonElement>[K] };

const numbers = naturalNumbers();

type RippleAnimation = {
  positionStyle: Ripple.PositionStyle;
  id: number;
};

const rippleStateStore = makeUnitManager<Ripple.State>();

const allAnimationsAreCompletedUnit = makeDerivedUnit(rippleStateStore).getUnit(
  animations => Object.values(animations).every(x => x === 'finished'),
);

function Button({
  size = 'm',
  variant = 'primary',
  onMouseDown,
  children,
  ...props
}: React.PropsWithChildren<Props>) {
  const [rippleAnimations, setRippleAnimations] = useState<RippleAnimation[]>(
    [],
  );
  const allAnimationsAreCompleted = allAnimationsAreCompletedUnit.useState();
  const setRippleStateStoreValue = rippleStateStore.useSetState();

  useLayoutEffect(() => {
    if (allAnimationsAreCompleted) {
      setRippleAnimations([]);
      setRippleStateStoreValue({});
    }
  }, [allAnimationsAreCompleted, setRippleStateStoreValue]);

  const rippleStateStoreMethods = rippleStateStore.useMethods();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const { left, top } = rect;

        const id = numbers.next().value as number;

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

      onMouseDown?.(e);
    },
    [onMouseDown, rippleStateStoreMethods],
  );

  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      className={b({
        size,
        variant,
        'no-animations': rippleAnimations.length === 0,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
      {...props}
    >
      {rippleAnimations.map(a => (
        <Ripple.Component
          positionStyle={a.positionStyle}
          key={a.id}
          unit={rippleStateStoreMethods.getUnit(a.id)}
        />
      ))}
      {children}
    </button>
  );
}

export const Component = withContextProviders(Button, [
  rippleStateStore.ContextProvider,
  allAnimationsAreCompletedUnit.ContextProvider,
]);
