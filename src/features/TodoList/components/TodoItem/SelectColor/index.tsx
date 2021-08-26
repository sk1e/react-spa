import React from 'react';

import { Select, Text } from 'components';
import { SwitchTheme } from 'features/global';
import { Todo, TodoColor } from 'types';
import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import { colors } from '../../../constants';
import './style.scss';

type Props = {
  activeColorState: UnitRenderInterface<Todo['color']>;
};

const b = block('select-color');

function useOptionColor(todoColor: Todo['color']) {
  const theme = SwitchTheme.themeStateUnit.useState();

  return (
    todoColor &&
    (theme === 'dark'
      ? darkThemeColorMap[todoColor]
      : lightThemeColorMap[todoColor])
  );
}

function Option({ option }: Select.Option.Props<Todo['color']>) {
  const color = useOptionColor(option);

  return (
    <Select.Option.Container.DefaultComponent>
      <Text.Component
        weight="bold"
        tagProps={{ style: { color } }}
        className={b('option')}
      >
        {option || ' '}
      </Text.Component>
    </Select.Option.Container.DefaultComponent>
  );
}

function ActiveOption({ option }: Select.Option.Props<Todo['color']>) {
  const color = useOptionColor(option);

  return (
    <Select.ActiveOption.Container.DefaultComponent>
      <Text.Component
        weight="bold"
        tagProps={{ style: { color } }}
        className={b('active-option')}
      >
        {option}
      </Text.Component>
    </Select.ActiveOption.Container.DefaultComponent>
  );
}

const darkThemeColorMap: Record<TodoColor, string> = {
  blue: 'cyan',
  green: 'chartreuse',
  orange: 'orange',
  purple: 'hotpink',
  red: 'red',
};

const lightThemeColorMap: Record<TodoColor, string> = {
  blue: 'blue',
  green: 'green',
  orange: 'darkorange',
  purple: 'purple',
  red: 'red',
};

const options: Array<Todo['color']> = [...colors, undefined];

function SelectColor({ activeColorState }: Props) {
  return (
    <Select.Component<Todo['color']>
      ActiveOption={ActiveOption}
      Option={Option}
      activeOptionState={activeColorState}
      options={options}
    />
  );
}

export const Component = React.memo(SelectColor) as typeof SelectColor;
