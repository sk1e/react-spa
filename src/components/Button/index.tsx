import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { makeDerivedUnit, makeUnitStore } from 'utils/State';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';
import { withContextProviders } from 'utils/react/withContextProviders';

import { Ripple } from './components';
import './style.scss';

export type Size = 's' | 'm' | 'l';
export type Variant = 'contained' | 'outlined' | 'text';

const b = block('button');

type Props = {
  size?: Size;
  className?: string;
  color?: 'primary' | 'secondary';
  variant?: Variant;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'classname' | 'type'> &
  { [K in 'type']-?: React.ButtonHTMLAttributes<HTMLButtonElement>[K] };

const numbers = naturalNumbers();

type RippleAnimation = {
  positionStyle: Ripple.PositionStyle;
  id: string;
};

const rippleStateStore = makeUnitStore<Ripple.State>();

const allAnimationsAreCompletedUnit = makeDerivedUnit(rippleStateStore).getUnit(
  animations => Object.values(animations).every(x => x === 'finished'),
);

function Button({
  size = 'm',
  color = 'primary',
  onMouseDown,
  children,
  className,
  variant = 'contained',
  ...props
}: React.PropsWithChildren<Props>) {
  const [rippleAnimations, setRippleAnimations] = useState<RippleAnimation[]>(
    [],
  );
  const allAnimationsAreCompleted = allAnimationsAreCompletedUnit.useState();
  const setRippleStateStoreValue = rippleStateStore.useSetState();

  useLayoutEffect(() => {
    // NOTE ripple animation node should not be detached when mouse button was pressed but not released,
    // otherwise click event will not be dispatched after mouse release.
    // All animations become completed outside of this range of time, so we can safely unmount them here
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

      onMouseDown?.(e);
    },
    [onMouseDown, rippleStateStoreMethods],
  );

  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      className={b(
        {
          size,
          variant,
          color,
          'no-animations': rippleAnimations.length === 0,
        },
        [className],
      )}
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
