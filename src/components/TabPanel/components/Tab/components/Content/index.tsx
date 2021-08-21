import React from 'react';

import { Text } from 'components';
import { block } from 'utils/classname';
import { useRequiredContext } from 'utils/react/RequiredContext';

import { DependenciesContext } from './dependenciesContext';
import './style.scss';

export { DependenciesContext } from './dependenciesContext';

const b = block('tab-content');

type Props<T> = {
  tab: T;
};

function Content<T>({ tab }: Props<T>) {
  const { isActive } = useRequiredContext(DependenciesContext);

  return (
    <Text.Component typography="label-xl" className={b({ active: isActive })}>
      {tab}
    </Text.Component>
  );
}

export const DefaultComponent = React.memo(Content) as typeof Content;
