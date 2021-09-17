import React from 'react';

import { block, classnames } from 'utils/classname';

import preloaderSrc from './preloader.svg';
import './style.scss';

const b = block('preloader');

type Size = 'm';

type Props = {
  className?: string;
  size?: Size;
};

function Preloader({ className, size = 'm' }: Props) {
  return (
    <img
      src={preloaderSrc}
      className={classnames(b({ size }), className)}
      alt="preloader"
    />
  );
}

export const Component = React.memo(Preloader);

export { Component as Preloader };
