import React from 'react';

import { Container, Content } from './components';

export { Container, Content } from './components';

export type Props<T> = {
  tab: T;
};

function DefaultTab<T>({ tab }: Props<T>) {
  return (
    <Container.DefaultComponent>
      <Content.DefaultComponent tab={tab} />
    </Container.DefaultComponent>
  );
}

export const DefaultComponent = React.memo(DefaultTab) as typeof DefaultTab;
