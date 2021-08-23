export type Todo = {
  id: string;
  text: string;
  status: TodoStatus;
  color?: TodoColor;
};

export type TodoStatus = 'active' | 'completed';
export type TodoColor = 'green' | 'blue' | 'orange' | 'purple' | 'red';
