import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import './style.scss';

const b = block('checkbox');

type Props = {
  checkState: UnitRenderInterface<boolean>;
};

function Checkbox({ checkState }: Props) {
  const [checked, setChecked] = [
    checkState.useState(),
    checkState.useSetState(),
  ];

  const handleCheckboxClick = useCallback(() => {
    setChecked(prev => !prev);
  }, [setChecked]);

  return (
    <div className={b({ checked })} onClick={handleCheckboxClick}>
      <div className={b('check')}>
        <FontAwesomeIcon icon={faCheck} />
      </div>
    </div>
  );
}

export const Component = React.memo(Checkbox) as typeof Checkbox;
