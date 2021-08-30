import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as c from './components';
import './style.scss';

export { Label } from './components';

const b = block('checkbox');

type Props<T> = {
  className?: string;
  checkState: UnitRenderInterface<boolean>;
  label?: T;
  Label?: React.ComponentType<c.Label.Props<T>>;
};

function Checkbox<T>({
  checkState,
  Label = c.Label.DefaultComponent,
  label,
  className,
}: Props<T>) {
  const [checked, setChecked] = [
    checkState.useState(),
    checkState.useSetState(),
  ];

  const handleCheckboxClick = useCallback(() => {
    setChecked(prev => !prev);
  }, [setChecked]);

  return (
    <div className={b({ checked }, [className])} onClick={handleCheckboxClick}>
      <div className={b('box')}>
        <div className={b('check')}>
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </div>
      {label && <Label label={label} />}
    </div>
  );
}

export const Component = React.memo(Checkbox) as typeof Checkbox;
