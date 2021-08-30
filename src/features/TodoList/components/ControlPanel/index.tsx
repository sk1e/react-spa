import React from 'react';

import { block } from 'utils/classname';

import * as c from './components';
import './style.scss';

export {
  statusFilterPredicateUnit,
  statusFilterUnit,
} from './components/FilterByStatus';
export {
  colorFilterPredicateUnit,
  ColorFilterPredicateContextProvider,
  stateUnits as colorStateUnits,
} from './components/FilterByColor';

const b = block('control-panel');

type Props = {
  onClearCompletedButtonClick(): void;
  onMarkAllCompletedButtonClick(): void;
  useRemainingTodos(): number;
};

function ControlPanel({
  onClearCompletedButtonClick,
  onMarkAllCompletedButtonClick,
  useRemainingTodos,
}: Props) {
  return (
    <div className={b()}>
      <c.Column.Component label="Actions">
        <c.Actions.Component
          onClearCompletedButtonClick={onClearCompletedButtonClick}
          onMarkAllCompletedButtonClick={onMarkAllCompletedButtonClick}
        />
      </c.Column.Component>
      <c.Column.Component label="Remaining Todos">
        <c.RemainingTodos.Component useRemainingTodos={useRemainingTodos} />
      </c.Column.Component>
      <c.Column.Component label="Filter by Status">
        <c.FilterByStatus.Component />
      </c.Column.Component>
      <c.Column.Component label="Filter by Color">
        <c.FilterByColor.Component />
      </c.Column.Component>
    </div>
  );
}

export const Component = React.memo(ControlPanel) as typeof ControlPanel;
