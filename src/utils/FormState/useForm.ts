import * as R from 'ramda';
import { useCallback, useMemo } from 'react';

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

function getFormElementsArray(formElements: any): Array<FormElementState<any>> {
  return Object.values(formElements).flatMap(x =>
    isFormElementState(x) ? x : getFormElementsArray(x),
  );
}

function getFormElementsState(formElementsGetState: any): any {
  return R.map(
    x => (typeof x === 'function' ? x() : getFormElementsState(x)),
    formElementsGetState,
  );
}

export type UseFormOptions = Partial<{
  resetOnSubmit: boolean;
}>;

function useResetFormState(
  formElementStateArray: Array<FormElementState<any>>,
) {
  const resetters = formElementStateArray.map(x => {
    const setState = x.units.value.useSetState();
    return () => setState(x.units.value.initialState);
  });

  return () => resetters.forEach(f => f());
}

export function useForm<T extends Record<string, any>>(
  formElements: T,
  { resetOnSubmit = true }: UseFormOptions = {},
): Form<T> {
  const formElementsGetState = useFormElementsGetState(formElements);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formElementsArray = useMemo(
    () => getFormElementsArray(formElements),
    [formElements],
  );
  const resetForm = useResetFormState(formElementsArray);

  const makeSubmitHandler = useCallback(
    (handleSubmit: (data: FormDataOf<T>) => void) =>
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        handleSubmit(getFormElementsState(formElementsGetState));

        if (resetOnSubmit) {
          resetForm();
        }
      },
    [formElementsGetState, resetOnSubmit, resetForm],
  );

  return {
    makeSubmitHandler,
  };
}
