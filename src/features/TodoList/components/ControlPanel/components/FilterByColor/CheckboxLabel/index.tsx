import React from 'react';

import { Checkbox, Text } from 'components';
import { activeLangStateUnit } from 'features/global/Language';
import { TodoColor, Translations } from 'types';
import { block } from 'utils/classname';

import './style.scss';

const b = block('checkbox-label');

const colorToTranslation: Record<TodoColor, Translations> = {
  blue: {
    en: 'Blue',
    ru: 'Синий',
  },
  green: {
    en: 'Green',
    ru: 'Зелёный',
  },
  orange: {
    en: 'Orange',
    ru: 'Оранжевый',
  },
  purple: {
    en: 'Purple',
    ru: 'Фиолетовый',
  },
  red: {
    en: 'Red',
    ru: 'Красный',
  },
};

function CheckboxLabel({ label }: Checkbox.Label.Props<TodoColor>) {
  const activeLang = activeLangStateUnit.useState();

  return (
    <Checkbox.Label.Container.DefaultComponent>
      <div className={b('marker-and-label')}>
        <div className={b('marker')} style={{ background: label }} />
        <Text.Component typography="label-m">
          {colorToTranslation[label][activeLang]}
        </Text.Component>
      </div>
    </Checkbox.Label.Container.DefaultComponent>
  );
}

export const Component = React.memo(CheckboxLabel) as typeof CheckboxLabel;
