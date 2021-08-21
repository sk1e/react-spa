import React from 'react';

import { block } from 'utils/classname';

import './style.scss';

const b = block('todo-list');

type Props = {};

function TodoList({}: Props) {
  return <div className={b()}>TodoList</div>;
}

export const Component = React.memo(TodoList) as typeof TodoList;
