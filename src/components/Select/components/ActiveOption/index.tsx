import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';

import { Container } from './components';

export { Container, Icon, Content } from './components';

const b = block('select');

export type Props<T> = {
  option: T;
};

function DefaultActiveOption<T>({ option }: Props<T>) {
  return (
    <Container.DefaultComponent>
      <Text.Component className={b('active-option')}>{option}</Text.Component>
    </Container.DefaultComponent>
  );
}

export const DefaultComponent = React.memo(
  DefaultActiveOption,
) as typeof DefaultActiveOption;
