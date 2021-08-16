import React from 'react';

import { TextInput } from 'components';
import { Translations } from 'types';
import { makeFormElementState } from 'utils/FormState';
import { nonEmptyString } from 'utils/validators';

type Props = {};

export const formElementState = makeFormElementState('', nonEmptyString);

const label: Translations = {
  en: 'Password',
  ru: 'Пароль',
};

function PasswordInput({}: Props) {
  return (
    <TextInput.Component label={label} formElementState={formElementState} />
  );
}

export const Component = React.memo(PasswordInput) as typeof PasswordInput;
