import React from 'react';

export function withContextProviders<Props>(
  Component: React.ComponentType<Props>,
  contextProviders: Array<React.ComponentType>,
  memo: boolean = true,
):
  | React.ComponentType<Props>
  | React.MemoExoticComponent<React.FunctionComponent<Props>> {
  const Result: React.ComponentType<Props> = (props: Props) =>
    contextProviders.reduce<React.ReactElement>(
      (acc, X): React.ReactElement => {
        return <X>{acc}</X>;
      },
      <Component {...props} />,
    );

  return memo ? React.memo(Result) : Result;
}
