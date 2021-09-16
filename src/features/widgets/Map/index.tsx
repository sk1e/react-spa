import React from 'react';

import { Text } from 'components';
import { MapWidget } from 'types';
import { block } from 'utils/classname';

import * as WidgetLayout from '../WidgetLayout';
import './style.scss';

const b = block('map-widget');

type Props = {
  widget: MapWidget;
};

function MapWidgetComponent({ widget }: Props) {
  return (
    <WidgetLayout.Component className={b()} widget={widget}>
      <Text.Component>MapWidget</Text.Component>
    </WidgetLayout.Component>
  );
}

export const Component = React.memo(
  MapWidgetComponent,
) as typeof MapWidgetComponent;
