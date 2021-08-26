import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';

import './style.scss';

const b = block('column');

type Props = {
  label: string;
};

function Column({ label, children }: React.PropsWithChildren<Props>) {
  return (
    <div className={b()}>
      <Text.Component typography="label-xl" className={b('label')}>
        {label}
      </Text.Component>
      {children}
    </div>
  );
}

export const Component = React.memo(Column) as typeof Column;
