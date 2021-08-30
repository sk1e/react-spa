import React from 'react';

import { Text } from 'components';

import * as Container from './Container';

export { Container };

export type Props<T> = {
  label: T;
};

function Label<T>({ label }: Props<T>) {
  return (
    <Container.DefaultComponent>
      <Text.Component>{label}</Text.Component>
    </Container.DefaultComponent>
  );
}

export const DefaultComponent = React.memo(Label) as typeof Label;
