import React from 'react';

import { block, classnames } from 'utils/classname';

import './style.scss';
import * as TS from './types';

export * from './types';

const b = block('text');

export type Props<T extends TS.Tag> = {
  typography?: TS.Typography;
  color?: TS.Color;
  as?: T;
  className?: string;
  weight?: TS.Weight;
  align?: TS.Align;
} & JSX.IntrinsicElements[T];

function Text<T extends TS.Tag>(props: React.PropsWithChildren<Props<T>>) {
  const {
    className,
    as = 'div',
    typography = 'text-m',
    color = 'primary',
    weight = 'normal',
    align = 'left',
    children,
    ...restProps
  } = props;

  return React.createElement(
    as,
    {
      className: classnames(className, b({ typography, color, weight, align })),
      ...restProps,
    },
    children,
  );
}

export const Component = React.memo(Text);
