import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useMemo } from 'react';

import { Text, Checkbox, Button } from 'components';
import { Todo } from 'types';
import { SetStateArg, UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as SelectColor from './SelectColor';
import './style.scss';

const b = block('todo-item');

type Props = {
  todoUnit: UnitRenderInterface<Todo>;
  onDelete(id: string): void;
};

function TodoItem({ todoUnit, onDelete }: Props) {
  const { id, text } = todoUnit.useState();

  const activeColorState: UnitRenderInterface<Todo['color']> = useMemo(
    () => ({
      useState: () => {
        return todoUnit.useState().color;
      },
      useSetState: () => {
        const setTodo = todoUnit.useSetState();

        return (value: SetStateArg<Todo['color']>) => {
          setTodo(prev => ({
            ...prev,
            color: typeof value === 'function' ? value(prev.color) : value,
          }));
        };
      },
    }),
    [todoUnit],
  );

  const checkState: UnitRenderInterface<boolean> = useMemo(
    () => ({
      useState: () => todoUnit.useState().status === 'completed',
      useSetState: () => {
        const setTodo = todoUnit.useSetState();

        return (value: SetStateArg<boolean>) => {
          setTodo(prev => {
            const wasChecked = prev.status === 'completed';
            const newValue =
              typeof value === 'function' ? value(wasChecked) : value;

            return {
              ...prev,
              status: newValue ? 'completed' : 'active',
            };
          });
        };
      },
    }),
    [todoUnit],
  );

  const handleDeleteButtonClick = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);
  return (
    <div className={b()}>
      <div className={b('left-part')}>
        <Checkbox.Component checkState={checkState} />
        <Text.Component weight="bold" className={b('text')}>
          {text}
        </Text.Component>
      </div>
      <div className={b('right-part')}>
        <SelectColor.Component activeColorState={activeColorState} />
        <Button.Component
          type="button"
          variant="text"
          className={b('delete-button')}
          onClick={handleDeleteButtonClick}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button.Component>
      </div>
    </div>
  );
}

export const Component = React.memo(TodoItem) as typeof TodoItem;
