import React from 'react';

import { Text } from 'components';
import { Header } from 'features/Header';
import { block } from 'utils/classname';

import './style.scss';

const b = block('main-layout');

type Props = {};

function MainLayout({ children }: React.PropsWithChildren<Props>) {
  return (
    <div className={b()}>
      <Header />
      <div className={b('sidebar-and-content')}>
        <div className={b('sidebar')}>
          <Text.Component>sidebar</Text.Component>
        </div>
        <div className={b('content')}>{children}</div>
      </div>
    </div>
  );
}

const Component = React.memo(MainLayout);

export { Component as MainLayout };
