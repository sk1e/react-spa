import React from 'react';

import { Text } from 'components';
import { DatalistWidget } from 'types';
import { block } from 'utils/classname';

import * as WidgetLayout from '../WidgetLayout';
import './style.scss';

const b = block('datalist-widget');

type Props = {
  widget: DatalistWidget;
};

function DatalistWidgetComponent({ widget }: Props) {
  return (
    <WidgetLayout.Component className={b()} widget={widget}>
      <Text.Component>DatalistWidget</Text.Component>
    </WidgetLayout.Component>
  );
}

export const Component = React.memo(
  DatalistWidgetComponent,
) as typeof DatalistWidgetComponent;
