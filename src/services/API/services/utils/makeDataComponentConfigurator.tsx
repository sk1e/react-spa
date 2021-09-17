import { Text, Preloader } from 'components';

import { CallState } from '../../types';

type DataComponentConfigurator<T> = {
  onSuccess(
    makePendingComponent: (data: T) => React.ReactNode,
  ): DataComponentConfigurator<T>;
  onPending?(
    makePendingComponent: () => React.ReactNode,
  ): DataComponentConfigurator<T>;
  getComponent(): React.ComponentType;
};

export function makeDataComponentConfigurator<T>(
  useState: () => CallState<T>,
): DataComponentConfigurator<T> {
  function pendingDefault() {
    return <Preloader.Component />;
  }

  function errorDefault(message: string) {
    return <Text.Component color="error">Error {message}</Text.Component>;
  }

  function loop(description: any): DataComponentConfigurator<T> {
    return Object.entries(description).reduce(
      (acc, [descriptionKey, descriptionValue]) => {
        switch (descriptionKey) {
          case 'pending':
            return descriptionValue === pendingDefault
              ? {
                  ...acc,
                  onPending: (getJSX: () => React.ReactNode) =>
                    loop({ ...description, pending: getJSX }),
                }
              : acc;
          case 'success':
            return descriptionValue === null
              ? {
                  ...acc,
                  onSuccess: (getJSX: (data: T) => React.ReactNode) =>
                    loop({ ...description, success: getJSX }),
                }
              : acc;
          case 'error':
            return descriptionValue === null
              ? {
                  ...acc,
                  onError: (getJSX: (message: string) => React.ReactNode) =>
                    loop({ ...description, success: getJSX }),
                }
              : acc;
          default:
            console.error('>> unexpected description key', descriptionKey);
            return acc;
        }
      },
      {
        getComponent: () => {
          return () => {
            const state = useState();

            switch (state.kind) {
              case 'successful':
                return description['success'](state.data);
              case 'pending':
                return description['pending']();
              case 'error':
                return description['error'](state.message);
              case 'initial':
                return null;
              default:
                console.error('unexpected call state', state);
                return () => null;
            }
          };
        },
      } as any,
    );
  }

  const initialData = {
    pending: pendingDefault,
    error: errorDefault,
    success: null,
  };

  return loop(initialData);
}
