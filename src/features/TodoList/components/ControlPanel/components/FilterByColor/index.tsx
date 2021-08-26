import React from 'react';

import { Checkbox } from 'components';
import { Todo, TodoColor } from 'types';
import {
  makeDerivedUnit,
  makePrimaryUnit,
  PrimaryStateUnit,
} from 'utils/State';
import { block } from 'utils/classname';
import { composeContextProviders } from 'utils/react';

import { colors } from '../../../../constants';
import './style.scss';

const b = block('filter-by-color');

type Props = {};

export const stateUnits: Record<
  TodoColor,
  PrimaryStateUnit<boolean>
> = colors.reduce(
  (acc, x) => ({ ...acc, [x]: makePrimaryUnit<boolean>(false) }),
  {} as Record<TodoColor, PrimaryStateUnit<boolean>>,
);

const unitEntries = Object.entries(stateUnits);
const units = unitEntries.map(([, value]) => value);
const unitKeys = unitEntries.map(([key]) => key);

export const todoFilterPredicateUnit = makeDerivedUnit(...units).getUnit(
  (...args) => {
    return (x: Todo) =>
      args.length === 0
        ? true
        : unitKeys
            .filter((_, index) => args[index])
            .includes(x.color as string);
  },
);

export const FilterContextProvider = composeContextProviders(
  ...Object.values(stateUnits).map(x => x.ContextProvider),
  todoFilterPredicateUnit.ContextProvider,
);

function FilterByColor({}: Props) {
  return (
    <div className={b()}>
      {colors.map(x => (
        <Checkbox.Component checkState={stateUnits[x]} key={x} />
      ))}
    </div>
  );
}

export const Component = React.memo(FilterByColor) as typeof FilterByColor;
