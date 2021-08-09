import React from 'react';

import { SwitchTheme } from 'features/global';
import { block } from 'utils/classname';

import './style.scss';

const b = block('header');

type Props = {};

function Header({}: Props) {
  return (
    <div className={b()}>
      <SwitchTheme.Component />
    </div>
  );
}

const Component = React.memo(Header);

export { Component as Header };
