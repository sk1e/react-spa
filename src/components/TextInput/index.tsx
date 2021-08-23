import React, { useCallback, useMemo } from 'react';

import { Language } from 'features/global';
import { Translations } from 'types';
import { FormElementState } from 'utils/FormState';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';

import * as Text from '../Text';
import './style.scss';

const b = block('text-input');

export type Props = {
  label: Translations;
  formElementState: FormElementState<string>;
};

const numbers = naturalNumbers();

function TextInput({ formElementState: { units, useMethods }, label }: Props) {
  const value = units.value.useState();
  const error = units.error.useState();
  const isValid = units.isValid.useState();
  const { changeValue, changeVisited } = useMethods();

  const id = useMemo(() => `text-input-${numbers.next().value}`, []);

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
        htmlFor={id}
        color={isValid ? 'primary' : 'error'}
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
