import React from 'react';

import * as RegisterForm from 'features/RegisterForm';
import * as TodoList from 'features/TodoList';
import { Example } from 'types';
import { block } from 'utils/classname';

import './style.scss';

const b = block('examples');

type Props = {
  useActiveExample(): Example;
};

function Examples({ useActiveExample }: Props) {
  const activeExample = useActiveExample();

  const ExampleComponent = (() => {
    switch (activeExample) {
      case 'Form':
        return RegisterForm.Component;
      case 'Todos':
        return TodoList.Component;
    }
  })();

  return (
    <div className={b()}>
      <ExampleComponent />
    </div>
  );
}

export const Component = React.memo(Examples) as typeof Examples;
