import * as R from 'ramda';

import { FormElementState } from './FormElementState';
import { isFormElementState } from './isFormElementState';

type FormDataOf<Elements> = {
  [P in keyof Elements]: Elements[P] extends FormElementState<infer T>
    ? T
    : FormDataOf<Elements[P]>;
};

type Form<Elements extends Record<string, any>> = {
  makeSubmitHandler(
    handleSubmit: (data: FormDataOf<Elements>) => void,
  ): (event: React.FormEvent<HTMLFormElement>) => void;
};

function useFormElementsGetState(formElements: any): any {
  return R.map(
    x =>
      isFormElementState(x)
        ? x.units.value.useGetState()
        : // eslint-disable-next-line react-hooks/rules-of-hooks
          useFormElementsGetState(x),
    formElements,
  );
}

function getFormElementsState(formElementsGetState: any): any {
  return R.map(
    x => (typeof x === 'function' ? x() : getFormElementsState(x)),
    formElementsGetState,
  );
}

export function useForm<T extends Record<string, any>>(
  formElements: T,
): Form<T> {
  const formElementsGetState = useFormElementsGetState(formElements);
  return {
    makeSubmitHandler:
      (handleSubmit: (data: FormDataOf<T>) => void) =>
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(getFormElementsState(formElementsGetState));
      },
  };
}
