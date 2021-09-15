export type CallState<T> =
  | InitialState
  | PendingState
  | ErrorState
  | SuccessfullState<T>;

type InitialState = {
  kind: 'initial';
};

type PendingState = {
  kind: 'pending';
};

type ErrorState = {
  kind: 'error';
  message: string;
};

type SuccessfullState<T> = {
  kind: 'successfull';
  data: T;
};
