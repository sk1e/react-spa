import React from 'react';

import { useRequiredContext } from 'utils/RequiredContext';
import { block } from 'utils/classname';

import * as Icon from '../Icon';
import { DependenciesContext } from './dependenciesContext';

export { DependenciesContext } from './dependenciesContext';

const b = block('select');

export type Props = {
  classname?: string;
};

function Container({ children, classname }: React.PropsWithChildren<Props>) {
  const { onClick } = useRequiredContext(DependenciesContext);
  return (
    <div
      className={b('active-option-container', [classname])}
      onClick={onClick}
    >
      {children}
      <Icon.DefaultComponent />
    </div>
  );
}

export const DefaultComponent = React.memo(Container) as typeof Container;
