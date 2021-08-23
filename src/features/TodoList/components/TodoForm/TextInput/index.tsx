import React from 'react';

import { TextInput } from 'components';
import { Translations } from 'types';
import { makeFormElementState } from 'utils/FormState';
import { block } from 'utils/classname';
import { nonEmptyString } from 'utils/validators';

import './style.scss';

const b = block('todo-text-input');

type Props = {};

const todoTextLabel: Translations = {
  en: 'Todo text',
  ru: 'Текст заметки',
};

export const formElementState = makeFormElementState('', nonEmptyString);

function TodoInput({}: Props) {
  return (
    <div className={b()}>
      <TextInput.Component
        label={todoTextLabel}
        formElementState={formElementState}
      />
    </div>
  );
}

export const Component = React.memo(TodoInput);
