import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { block } from 'utils/classname';

const b = block('select');

type Props = {};

function Icon({}: Props) {
  return (
    <div className={b('active-option-icon')}>
      <FontAwesomeIcon icon={faAngleDown} />
    </div>
  );
}

export const DefaultComponent = React.memo(Icon) as typeof Icon;
