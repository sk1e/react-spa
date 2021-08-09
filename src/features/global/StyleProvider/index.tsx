import React from 'react';

import { themeToColorsMap } from 'style/colors';
import { Theme } from 'types';

import { themeStateUnit } from '../SwitchTheme';

type Props = {};

type HSLColor = {
  hue: string;
  saturation: string;
  lightness: string;
  alpha?: string;
};

const hslRegexp = /hsl\((.+?),(.+?),(.+?)(?:,(.+?))?\)/;

function parseHSL(str: string): HSLColor | null {
  const match = hslRegexp.exec(str);

  if (match) {
    const [, hue, saturation, lightness, alpha] = match;
    return { hue, lightness, saturation, alpha };
  }

  return null;
}

const hslComponentNames = ['hue', 'saturation', 'lightness', 'alpha'] as const;

type HSLComponentName = typeof hslComponentNames[number];

function getColorVars(varName: string, value: string) {
  const hslComponents = parseHSL(value);

  if (hslComponents === null) {
    return {
      [`--color-${varName}`]: value,
    };
  }

  const { hue, lightness, saturation, alpha } = hslComponents;

  const getComponentVarName = (component: HSLComponentName) =>
    `--color-${varName}-${component}`;
  const getComponentVarExpr = (component: HSLComponentName) =>
    `var(${getComponentVarName(component)})`;

  const componentsExpressions = hslComponentNames
    .map(getComponentVarExpr)
    .join(', ');

  const colorVarValue = `hsl(${componentsExpressions})`;

  return {
    [`--color-${varName}`]: colorVarValue,
    [getComponentVarName('hue')]: hue,
    [getComponentVarName('saturation')]: saturation,
    [getComponentVarName('lightness')]: lightness,
    [getComponentVarName('alpha')]: alpha || '1',
  };
}

function makeStyle(theme: Theme): Record<string, string> {
  return Object.entries(themeToColorsMap[theme]).reduce(
    (acc, [colorVarName, value]) => ({
      ...acc,
      ...getColorVars(colorVarName, value),
    }),
    {},
  );
}

function StyleProvider({ children }: React.PropsWithChildren<Props>) {
  const theme = themeStateUnit.useState();

  return <div style={makeStyle(theme)}>{children}</div>;
}

export const Component = React.memo(StyleProvider);
