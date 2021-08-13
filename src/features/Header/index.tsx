import React from 'react';

import { SwitchTheme, Language } from 'features/global';
import { block } from 'utils/classname';

import './style.scss';

const b = block('header');

type Props = {};

function Header({}: Props) {
  return (
    <div className={b()}>
      <Language.SwitchLang />
      <div className={b('switch-theme')}>
        <SwitchTheme.Component />
      </div>
    </div>
  );
}

const Component = React.memo(Header);

export { Component as Header };
