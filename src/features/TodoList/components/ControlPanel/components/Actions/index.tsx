import React from 'react';

import { Button } from 'components';
import { useTranslation } from 'features/global/Language';
import { block } from 'utils/classname';

import './style.scss';

const b = block('actions');

type Props = {
  onMarkAllCompletedButtonClick(): void;
  onClearCompletedButtonClick(): void;
};

function Actions({
  onClearCompletedButtonClick,
  onMarkAllCompletedButtonClick,
}: Props) {
  const markAllCompletedLabel = useTranslation({
    en: 'Mark All Completed',
    ru: 'Пометить все завершёнными',
  });

  const clearCompletedLabel = useTranslation({
    en: 'Clear completed',
    ru: 'Удалить завершённые',
  });

  return (
    <div className={b()}>
      <Button.Component type="button" onClick={onMarkAllCompletedButtonClick}>
        {markAllCompletedLabel}
      </Button.Component>
      <Button.Component
        type="button"
        className={b('clear-completed-button')}
        onClick={onClearCompletedButtonClick}
      >
        {clearCompletedLabel}
      </Button.Component>
    </div>
  );
}

export const Component = React.memo(Actions) as typeof Actions;
