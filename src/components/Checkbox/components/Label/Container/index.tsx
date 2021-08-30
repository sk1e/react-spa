import React from 'react';

import { block } from 'utils/classname';

import './style.scss';

const b = block('label-container');

type Props = {};

function Container({ children }: React.PropsWithChildren<Props>) {
  return <div className={b()}>{children}</div>;
}

export const DefaultComponent = React.memo(Container) as typeof Container;
