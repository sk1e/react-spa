import * as R from 'ramda';
import { useCallback } from 'react';

import { Todo } from 'types';
import { makeDerivedUnit, makeUnitStore } from 'utils/State';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';
import { withContextProviders } from 'utils/react';

import { TodoItem, TodoForm, ControlPanel } from './components';
import './style.scss';

const b = block('todo-list');

type Props = {};

const todoStore = makeUnitStore<Todo>();

const sortedTodos = makeDerivedUnit(todoStore).getUnit(todos => {
  return R.sortBy(x => x.id, Object.values(todos));
}, 'sorted');

const filteredAndSortedTodos = makeDerivedUnit(
  sortedTodos,
  ControlPanel.colorFilterPredicateUnit,
  ControlPanel.statusFilterPredicateUnit,
).getUnit(
  (todos, colorPredicate, statusPredicate) =>
    todos.filter(colorPredicate).filter(statusPredicate),
  'filtered and sorted',
);

const numbers = naturalNumbers();

const remaingingTodos = makeDerivedUnit(todoStore).getUnit(
  todos => Object.values(todos).filter(x => x.status === 'active').length,
);

function TodoList({}: Props) {
  const todos = filteredAndSortedTodos.useState();

  const { addUnit, getUnit } = todoStore.useMethods();
  const setTodoStore = todoStore.useSetState();

  const handleTodoFormSubmit = useCallback(
    (data: TodoForm.TodoFormData) => {
      const id = numbers.next().value.toString();
      addUnit(id, { id, status: 'active', text: data.text });
    },
    [addUnit],
  );

  const handleTodoItemDelete = useCallback(
    (id: string) => {
      setTodoStore(prev => R.omit([id], prev));
    },
    [setTodoStore],
  );

  const handleClearCompletedButtonClick = useCallback(() => {
    setTodoStore(prev =>
      R.pickBy((val: Todo) => val.status !== 'completed', prev),
    );
  }, [setTodoStore]);

  const handleMarkAllCompletedButtonClick = useCallback(() => {
    setTodoStore(prev => R.map(x => ({ ...x, status: 'completed' }), prev));
  }, [setTodoStore]);

  return (
    <div className={b()}>
      <TodoForm.Component onSubmit={handleTodoFormSubmit} />
      <div className={b('list')}>
        {todos.map(x => (
          <TodoItem.Component
            key={x.id}
            todoUnit={getUnit(x.id)}
            onDelete={handleTodoItemDelete}
          />
        ))}
      </div>
      <ControlPanel.Component
        onClearCompletedButtonClick={handleClearCompletedButtonClick}
        onMarkAllCompletedButtonClick={handleMarkAllCompletedButtonClick}
        useRemainingTodos={remaingingTodos.useState}
      />
    </div>
  );
}

export const Component = withContextProviders(TodoList, [
  todoStore.ContextProvider,
  ControlPanel.statusFilterUnit.ContextProvider,
  ControlPanel.ColorFilterPredicateContextProvider,
]);
