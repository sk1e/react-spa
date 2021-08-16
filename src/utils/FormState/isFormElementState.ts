import { FormElementState } from './FormElementState';

export function isFormElementState(x: any): x is FormElementState<any> {
  return (x as FormElementState<any>).kind === 'form-element-state';
}
