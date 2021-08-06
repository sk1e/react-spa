import React from 'react';

import { block, classnames } from 'utils/classname';

import './style.scss';
import * as TS from './types';

const b = block('text');

export type Props = {
  typography?: TS.Typography;
  color?: TS.Color;
  as?: TS.Tag;
  className?: string;
  weight?: TS.Weight;
  align?: TS.Align;
};

function Text(props: React.PropsWithChildren<Props>) {
  const {
    className,
    as = 'div',
    typography = 'text-m',
    color = 'primary',
    weight = 'normal',
    align = 'left',
    children,
  } = props;

  return React.createElement(
    as,
    {
      className: classnames(className, b({ typography, color, weight, align })),
    },
    children,
  );
}

export const Component = React.memo(Text);
