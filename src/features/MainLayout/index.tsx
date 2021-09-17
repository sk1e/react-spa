import React from 'react';

import { Header } from 'features/Header';
import { block } from 'utils/classname';

import './style.scss';

const b = block('main-layout');

type Props = {
  TabPanel?: React.ComponentType;
  SidePanel?: React.ComponentType;
};

function MainLayout({
  children,
  TabPanel,
  SidePanel,
}: React.PropsWithChildren<Props>) {
  return (
    <div className={b()}>
      <Header />
      <div className={b('side-panel-and-content')}>
        {SidePanel && (
          <div className={b('side-panel')}>
            <SidePanel />
          </div>
        )}
        <div className={b('content-outer')}>
          {TabPanel && <TabPanel />}
          <div className={b('content-with-padding')}>
            <div className={b('scrollable-content')}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = React.memo(MainLayout);
