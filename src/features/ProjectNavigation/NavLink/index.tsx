import React from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import { Text } from 'components';
import { block } from 'utils/classname';

import './style.scss';

const b = block('project-nav-link');

type Props = {
  to: string;
};

function NavLink({ to, children }: React.PropsWithChildren<Props>) {
  const match = useRouteMatch({ path: to });

  return (
    <Link to={to} className={b({ active: match !== null })}>
      <Text.Component
        color={match === null ? 'primary' : 'accent-primary'}
        typography="heading-m"
        className={b('text')}
      >
        {children}
      </Text.Component>
    </Link>
  );
}

export const Component = React.memo(NavLink) as typeof NavLink;
