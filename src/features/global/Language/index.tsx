import React from 'react';

import { Select } from 'components';
import { Language } from 'types';
import { block } from 'utils/classname';

import { activeLangStateUnit } from './activeLangStateUnit';
import './style.scss';

export { useTranslation } from './useTranslation';
export { activeLangStateUnit } from './activeLangStateUnit';

const b = block('switch-lang');

type Props = {};

const langToLabel: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
};

function Option({ option }: Select.Option.Props<Language>) {
  return (
    <Select.Option.Container.DefaultComponent classname={b('option-container')}>
      <Select.Option.Content.DefaultComponent option={langToLabel[option]} />
    </Select.Option.Container.DefaultComponent>
  );
}

function ActiveOption({ option }: Select.Option.Props<Language>) {
  return (
    <Select.ActiveOption.Container.DefaultComponent
      classname={b('option-container')}
    >
      <Select.ActiveOption.Content.DefaultComponent option={option} />
    </Select.ActiveOption.Container.DefaultComponent>
  );
}

function SwitchLang({}: Props) {
  return (
    <div className={b()}>
      <Select.Component<Language>
        options={['en', 'ru']}
        activeOptionState={activeLangStateUnit}
        Option={Option}
        ActiveOption={ActiveOption}
      />
    </div>
  );
}

export const Component = React.memo(SwitchLang);

export { Component as SwitchLang };
