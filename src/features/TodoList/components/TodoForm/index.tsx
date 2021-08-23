import React, { useMemo } from 'react';

import { Button } from 'components';
import { useTranslation } from 'features/global/Language';
import { useForm } from 'utils/FormState';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import * as TextInput from './TextInput';
import './style.scss';

const b = block('todo-form');

export type TodoFormData = {
  text: string;
};

type Props = {
  onSubmit(data: TodoFormData): void;
};

function TodoForm({ onSubmit }: Props) {
  const buttonLabel = useTranslation({
    en: 'Add',
    ru: 'Добавить',
  });

  const { makeSubmitHandler } = useForm({
    text: TextInput.formElementState,
  });

  const handleSubmit = useMemo(
    () => makeSubmitHandler(onSubmit),
    [makeSubmitHandler, onSubmit],
  );

  return (
    <form className={b()} onSubmit={handleSubmit}>
      <TextInput.Component />
      <Button.Component type="submit" className={b('submit-button')}>
        {buttonLabel}
      </Button.Component>
    </form>
  );
}

export const Component = withContextProviders(TodoForm, [
  TextInput.formElementState.ContextProvider,
]);
