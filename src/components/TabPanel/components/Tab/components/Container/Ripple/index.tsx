import React, { useCallback } from 'react';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import './style.scss';

const b = block('tab-ripple');

export type PositionStyle = {
  left: string;
  top: string;
};

type AnimationStatus = 'active' | 'finished';

export type State = AnimationStatus;

type Props = {
  positionStyle: PositionStyle;
  unit: UnitRenderInterface<AnimationStatus>;
};

function Ripple({ positionStyle, unit }: Props) {
  const setState = unit.useSetState();
  const handleAnimationEnd = useCallback(() => {
    setState('finished');
  }, [setState]);

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      style={positionStyle}
      className={b()}
    />
  );
}

export const Component = React.memo(Ripple);
