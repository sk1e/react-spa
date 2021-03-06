export type Tag = Extract<
  keyof React.ReactHTML,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label' | 'span'
>;

export type Typography =
  | 'heading-xl'
  | 'heading-l'
  | 'text-s'
  | 'text-m'
  | 'label-m'
  | 'label-l'
  | 'label-xl';

export type Color = 'primary' | 'secondary' | 'error';

export type Weight = 'normal' | 'bold';

export type Align = 'left' | 'center' | 'right';
