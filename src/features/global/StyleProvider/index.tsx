import React, { useEffect } from 'react';

import { themeStateUnit } from '../SwitchTheme';
// import { createStyleForThemes } from './createStyleForThemes';
import { setBodyModifer } from './setBodyModifier';

type Props = {};

function StyleProvider({ children }: React.PropsWithChildren<Props>) {
  const theme = themeStateUnit.useState();

  useEffect(() => {
    setBodyModifer(theme);
  }, [theme]);

  return <div>{children}</div>;
}

export const Component = React.memo(StyleProvider);
