import React from 'react';

import { SwitchTheme } from 'features/SwitchTheme';
import { block } from 'utils/classname';

import './style.scss';

const b = block('header');

type Props = {};

function Header({}: Props) {
  return (
    <div className={b()}>
      <SwitchTheme />
    </div>
  );
}

const Component = React.memo(Header);

export { Component as Header };
