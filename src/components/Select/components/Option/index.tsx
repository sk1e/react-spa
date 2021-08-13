import React from 'react';

import { Container, Content } from './components';

export { Container, Content } from './components';

export type Props<T> = {
  option: T;
};

function DefaultOption<T>({ option }: Props<T>) {
  return (
    <Container.DefaultComponent>
      <Content.DefaultComponent option={option} />
    </Container.DefaultComponent>
  );
}

export const DefaultComponent = React.memo(
  DefaultOption,
) as typeof DefaultOption;
