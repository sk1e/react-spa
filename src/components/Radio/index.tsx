import React, { useCallback } from 'react';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as Text from '../Text';
import './style.scss';

const b = block('radio');

type Props<T> = {
  className?: string;
  label: string;
  value: T;
  activeValueStateUnit: UnitRenderInterface<T>;
};

function Radio<T>({ className, label, value, activeValueStateUnit }: Props<T>) {
  const [activeValue, setActiveValue] = [
    activeValueStateUnit.useState(),
    activeValueStateUnit.useSetState(),
  ];

  const handleRadioClick = useCallback(() => {
    setActiveValue(value);
  }, [setActiveValue, value]);

  return (
    <div
      className={b({ active: value === activeValue }, [className])}
      onClick={handleRadioClick}
    >
      <div className={b('circle')}>
        <div className={b('inner-circle')} />
      </div>
      <Text.Component typography="label-m" className={b('label')}>
        {label}
      </Text.Component>
    </div>
  );
}

export const Component = React.memo(Radio) as typeof Radio;
