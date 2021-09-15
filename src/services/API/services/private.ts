import { useCallback } from 'react';

import { PrimaryStateUnit } from 'utils/State';

import { CallState } from '../types';

type Res<Params, Result> = (
  unit: PrimaryStateUnit<CallState<Result>>,
) => (data: Params) => void;

type RequestMethod = 'get' | 'post';

export function makeRequest<
  Input extends Record<string, any>,
  APIOutput,
  ConvertedOutput,
>(
  name: string,
  method: RequestMethod,
  converter: (output: APIOutput) => ConvertedOutput,
): Res<Input, ConvertedOutput> {
  const getEndpoint = (() => {
    switch (method) {
      case 'get':
        return (input: Input) => {
          const params = new URLSearchParams(input).toString();
          return `/services/${name}/?${params}`;
        };
      default:
        return () => `/services/${name}/`;
    }
  })();

  const getBody = (() => {
    switch (method) {
      case 'post':
        return (input: Input) =>
          new URLSearchParams({ data: JSON.stringify(input.data) }).toString();

      default:
        return () => undefined;
    }
  })();

  return (unit: PrimaryStateUnit<CallState<ConvertedOutput>>) => {
    const setState = unit.useSetState();

    const callAPI = useCallback(
      (input: Input) => {
        setState({ kind: 'pending' });

        fetch(getEndpoint(input), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: method.toUpperCase(),
          body: getBody(input),
        })
          .then(response => response.text())
          .then(text => {
            const output = JSON.parse(text);

            switch (output.status) {
              case 0: {
                setState({ kind: 'error', message: output.error });
                break;
              }
              case 1: {
                const data = converter(output.response);
                setState({ kind: 'successfull', data });
              }
            }
          })
          .catch((error: Error) => {
            if (error.name !== 'AbortError') {
              setState({ kind: 'error', message: error.message });
            }
          });
      },
      [setState],
    );

    return callAPI;
  };
}