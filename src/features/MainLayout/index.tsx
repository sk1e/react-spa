import React from 'react';

import { Text } from 'components';
import { Header } from 'features/Header';
import { Language } from 'features/global';
import { block } from 'utils/classname';

import './style.scss';

const b = block('main-layout');

type Props = {};

function MainLayout({ children }: React.PropsWithChildren<Props>) {
  const sidebarText = Language.useTranslation({
    en: 'sidebar',
    ru: 'боковая панель',
  });

  return (
    <div className={b()}>
      <Header />
      <div className={b('sidebar-and-content')}>
        <div className={b('sidebar')}>
          <Text.Component>{sidebarText}</Text.Component>
        </div>
        <div className={b('content')}>{children}</div>
      </div>
    </div>
  );
}

const Component = React.memo(MainLayout);

export { Component as MainLayout };
