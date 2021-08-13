import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';

const b = block('select');

type Props<T> = {
  option: T;
};

function Content<T>({ option }: Props<T>) {
  return (
    <div className={b()}>
      <Text.Component className={b('active-option')}>{option}</Text.Component>
    </div>
  );
}

export const DefaultComponent = React.memo(Content) as typeof Content;
