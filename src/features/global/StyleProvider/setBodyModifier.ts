import { Theme } from 'types';
import { block } from 'utils/classname';

const b = block('body');

export function setBodyModifer(theme: Theme): void {
  document.body.className = '';
  document.body.classList.add(...b({ theme }).split(' '));
}
