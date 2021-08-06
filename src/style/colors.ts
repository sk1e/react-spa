import { Theme } from 'types';

type ThemeToColor = { [K in Theme]: ThemeColors };

type ThemeColors = typeof darkThemeColors;

const darkThemeColors = {
  'bg-1': 'hsl(0, 0%, 15%)',
  'bg-2': 'hsl(0, 0%, 18%)',
  'fg-primary': 'hsl(185, 92%, 85%)',
  'fg-secondary': 'hsl(185, 92%, 40%)',
  'fg-error': 'hsla(0, 85%, 55%, 1)',
  'accent-primary': 'hsl(261, 91%, 56%)',
};

const lightThemeColors: ThemeColors = {
  'bg-1': 'hsl(0, 0%, 95%)',
  'bg-2': 'hsl(0, 0%, 90%)',
  'fg-primary': 'hsl(0, 0%, 5%)',
  'fg-secondary': 'hsl(0, 0%, 25%)',
  'fg-error': 'hsla(0, 85%, 55%, 1)',
  'accent-primary': 'hsl(210, 100%, 56%)',
};

export const themeToColorsMap: ThemeToColor = {
  dark: darkThemeColors,
  light: lightThemeColors,
};
