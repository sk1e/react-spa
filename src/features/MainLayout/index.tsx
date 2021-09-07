import React from 'react';

import { Text } from 'components';
import { Header } from 'features/Header';
import { Language } from 'features/global';
import { block } from 'utils/classname';

import './style.scss';

const b = block('main-layout');

type Props = {
  TabPanel?: React.ComponentType;
};

function MainLayout({ children, TabPanel }: React.PropsWithChildren<Props>) {
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
        <div className={b('content-outer')}>
          {TabPanel && <TabPanel />}
          <div className={b('content-inner')}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Component = React.memo(MainLayout);
