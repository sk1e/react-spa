import React, { useCallback } from 'react';

import { Button } from 'components';
import { Theme } from 'types';
import { makePrimaryUnit } from 'utils/State';
import { block } from 'utils/classname';

const b = block('switch-theme');

export const themeStateUnit = makePrimaryUnit<Theme>('dark');

function SwitchTheme() {
  const [theme, setTheme] = [
    themeStateUnit.useState(),
    themeStateUnit.useSetState(),
  ];

  const handleButtonClick = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return (
    <div className={b()}>
      <Button.Component type="button" onClick={handleButtonClick}>
        {theme}
      </Button.Component>
    </div>
  );
}

const Component = React.memo(SwitchTheme);

export { Component as SwitchTheme };
