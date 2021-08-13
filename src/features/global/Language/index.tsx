import React from 'react';

import { Select } from 'components';
import { block } from 'utils/classname';

import { activeLangStateUnit } from './activeLangStateUnit';
import './style.scss';
import { Lang } from './types';

export { useTranslation } from './useTranslation';
export { activeLangStateUnit } from './activeLangStateUnit';
export type { Lang } from './types';

const b = block('switch-lang');

type Props = {};

const langToLabel: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
};

function Option({ option }: Select.Option.Props<Lang>) {
  return (
    <Select.Option.Container.DefaultComponent classname={b('option-container')}>
      <Select.Option.Content.DefaultComponent option={langToLabel[option]} />
    </Select.Option.Container.DefaultComponent>
  );
}

function ActiveOption({ option }: Select.Option.Props<Lang>) {
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
      <Select.Component<Lang>
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
