import React from 'react';

import { Text } from 'components';
import { GalleryWidget } from 'types';
import { block } from 'utils/classname';

import * as WidgetLayout from '../WidgetLayout';
import './style.scss';

const b = block('gallery-widget');

type Props = {
  widget: GalleryWidget;
};

function GalleryWidgetComponent({ widget }: Props) {
  return (
    <WidgetLayout.Component className={b()} widget={widget}>
      <Text.Component>GalleryWidget</Text.Component>
    </WidgetLayout.Component>
  );
}

export const Component = React.memo(
  GalleryWidgetComponent,
) as typeof GalleryWidgetComponent;
