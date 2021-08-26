import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';

import './style.scss';

const b = block('remaining-todos');

type Props = {
  useRemainingTodos(): number;
};

function RemainingTodos({ useRemainingTodos }: Props) {
  const remainingTodos = useRemainingTodos();

  return (
    <div className={b()}>
      <Text.Component>{remainingTodos} items left</Text.Component>
    </div>
  );
}

export const Component = React.memo(RemainingTodos) as typeof RemainingTodos;
