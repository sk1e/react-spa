import * as R from 'ramda';
import { useCallback } from 'react';

import { Todo } from 'types';
import { makeDerivedUnit, makeUnitStore } from 'utils/State';
import { block } from 'utils/classname';
import { naturalNumbers } from 'utils/math';
import { withContextProviders } from 'utils/react';

import { TodoItem, TodoForm } from './components';
import './style.scss';

const b = block('todo-list');

type Props = {};

const todoStore = makeUnitStore<Todo>();

const sortedTodos = makeDerivedUnit(todoStore).getUnit(todos =>
  R.sortBy(x => x.id, Object.values(todos)),
);

const numbers = naturalNumbers();

function TodoList({}: Props) {
  const todos = sortedTodos.useState();
  const { addUnit, getUnit } = todoStore.useMethods();
  const setTodoStore = todoStore.useSetState();

  // const handleTodoAdd = useCallback((todoText: string) => {
  //   const id = numbers.next().value?.toString() as string;
  //   addUnit(id, { id, status: 'active', text: todoText })
  // }, [addUnit])

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
    </div>
  );
}

export const Component = withContextProviders(TodoList, [
  todoStore.ContextProvider,
]);
