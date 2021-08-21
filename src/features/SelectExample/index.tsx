import React from 'react';

import { TabPanel } from 'components';
import { makePrimaryUnit } from 'utils/State';
import { block } from 'utils/classname';

import './style.scss';

const b = block('select-example');

type Props = {};

type Example = 'Todos' | 'Form';

const examples: Example[] = ['Todos', 'Form'];

export const activeExampleStateUnit = makePrimaryUnit<Example>('Todos');

function SelectExample({}: Props) {
  return (
    <div className={b()}>
      <TabPanel.Component<Example>
        activeTabState={activeExampleStateUnit}
        tabs={examples}
      />
    </div>
  );
}

export const Component = React.memo(SelectExample);
