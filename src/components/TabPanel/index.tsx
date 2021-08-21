import React, { useMemo } from 'react';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as c from './components';
import './style.scss';

const b = block('tab-panel');

type Props<T> = {
  tabs: T[];
  activeTabState: UnitRenderInterface<T>;
  Tab?: React.ComponentType<c.Tab.Props<T>>;
};

function TabPanel<T extends string>({
  activeTabState,
  tabs,
  Tab = c.Tab.DefaultComponent,
}: Props<T>) {
  const [activeTab, setActiveTab] = [
    activeTabState.useState(),
    activeTabState.useSetState(),
  ];

  const activeTabIndex = useMemo(
    () => tabs.indexOf(activeTab),
    [tabs, activeTab],
  );

  console.log('>> index', activeTabIndex);

  return (
    <div className={b()}>
      <div className={b('tabs')}>
        {tabs.map((x, index) => {
          const isActive = x === activeTab;

          return (
            <c.Tab.Container.DependenciesContext.Provider
              key={index}
              isActive={x === activeTab}
              setActiveTab={setActiveTab}
              tab={x}
            >
              <c.Tab.Content.DependenciesContext.Provider isActive={isActive}>
                <Tab tab={x} />
              </c.Tab.Content.DependenciesContext.Provider>
            </c.Tab.Container.DependenciesContext.Provider>
          );
        })}
      </div>
      <div
        className={b('active-tab-line')}
        style={{ transform: `translateX(${150 * activeTabIndex}px)` }}
      />
    </div>
  );
}

export const Component = React.memo(TabPanel) as typeof TabPanel;
