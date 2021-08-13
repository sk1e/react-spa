import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';

const b = block('select');

type Props<T> = {
  option: T;
};

function Content<T>({ option }: Props<T>) {
  return <Text.Component className={b('option-text')}>{option}</Text.Component>;
}

export const DefaultComponent = React.memo(Content) as typeof Content;
