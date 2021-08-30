import React from 'react';

import { Radio } from 'components';
import { Todo } from 'types';
import { makeDerivedUnit, makePrimaryUnit } from 'utils/State';
import { block } from 'utils/classname';

import './style.scss';

const b = block('filter-by-status');

type Props = {};

type StatusFilter = 'all' | 'active' | 'completed';

export const statusFilterUnit = makePrimaryUnit<StatusFilter>('all');

export const statusFilterPredicateUnit = makeDerivedUnit(
  statusFilterUnit,
).getUnit((x): ((x: Todo) => boolean) => {
  switch (x) {
    case 'active':
      return (y: Todo) => y.status === 'active';
    case 'completed':
      return (y: Todo) => y.status === 'completed';
    case 'all':
      return () => true;
  }
});

function FilterByStatus({}: Props) {
  return (
    <div className={b()}>
      <Radio.Component<StatusFilter>
        className={b('radio')}
        label="All"
        value="all"
        activeValueStateUnit={statusFilterUnit}
      />
      <Radio.Component<StatusFilter>
        className={b('radio')}
        label="Active"
        value="active"
        activeValueStateUnit={statusFilterUnit}
      />
      <Radio.Component<StatusFilter>
        className={b('radio')}
        label="Completed"
        value="completed"
        activeValueStateUnit={statusFilterUnit}
      />
    </div>
  );
}

export const Component = React.memo(FilterByStatus) as typeof FilterByStatus;
