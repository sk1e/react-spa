import React, { useCallback } from 'react';

import { Language, IDProvider } from 'features/global';
import { Translations } from 'types';
import { FormElementState } from 'utils/FormState';
import { block } from 'utils/classname';

import * as Text from '../Text';
import './style.scss';

const b = block('text-input');

export type Props = {
  label: Translations;
  formElementState: FormElementState<string>;
};

function TextInput({ formElementState: { units, useMethods }, label }: Props) {
  const value = units.value.useState();
  const error = units.error.useState();
  const isValid = units.isValid.useState();
  const { changeValue, changeVisited } = useMethods();

  const id = IDProvider.useID('text-input');

  const lang = Language.activeLangStateUnit.useState();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeValue(e.target.value);
    },
    [changeValue],
  );

  const handleBlur = useCallback(() => {
    changeVisited(true);
  }, [changeVisited]);

  return (
    <div className={b({ invalid: !isValid })}>
      <Text.Component
        className={b('label')}
        typography="label-m"
        as="label"
        color={isValid ? 'primary' : 'error'}
        tagProps={{ htmlFor: id }}
      >
        {label[lang]}
      </Text.Component>
      <input
        id={id}
        value={value}
        className={b('input')}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {error && (
        <Text.Component className={b('error')} color="error">
          {error[lang]}
        </Text.Component>
      )}
    </div>
  );
}

export const Component = React.memo(TextInput) as typeof TextInput;
