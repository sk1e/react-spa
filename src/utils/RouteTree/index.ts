export interface IQueryParams {
  [param: string]: string;
}

export interface RouteInterface {
  getPath(queryParams?: IQueryParams): string;
  getElementKey(): string;
}

export type RouteTree<T> = T extends StateNode<infer S, infer Name, infer Tree>
  ? Record<S | Name, RouteTree<Tree>>
  : T extends null
  ? RouteInterface
  : { [P in keyof T]: RouteTree<T[P]> };

type RawRouteTree = {
  [routeKey: string]:
    | RawRouteTree
    | StateNode<string, string, Record<string, any>>
    | null;
};

type StateNode<
  X extends string,
  N extends string,
  T extends Record<string, any>,
> = {
  kind: 'state';
  values: X[];
  tree: T;
  name: N;
};

function isStateTree(
  x: any,
): x is StateNode<string, string, Record<string, any>> {
  return (x as StateNode<string, string, Record<string, any>>).kind === 'state';
}

export function makeRouteTree<
  T extends RawRouteTree | StateNode<string, string, Record<string, any>>,
>(rawTree: T): RouteTree<T> {
  return (function loop(
    tree: Record<string, any> | StateNode<string, string, Record<string, any>>,
    path: string[] = [],
  ): RouteTree<T> {
    if (isStateTree(tree)) {
      return {
        ...tree.values.reduce((acc: any, nodeKey: string) => {
          const xPath = [...path, nodeKey];

          return {
            ...acc,
            [nodeKey]: loop(tree.tree, xPath),
          };
        }, {}),
        [tree.name]: (() => {
          const key = tree.name.toLowerCase();
          const values = tree.values.join('|');
          const nodeElement = `:${key}(${values})`;
          const xPath = [...path, nodeElement];

          return loop(tree.tree, xPath);
        })(),
      };
    }

    return Object.entries(tree).reduce((acc: any, [key, value]) => {
      const xPath = [...path, key];

      const formattedPathElements = xPath;
      const formattedPath = `/${formattedPathElements.join('/')}`;

      const routeData: RouteInterface = {
        getPath: makeGetPath(formattedPath),
        getElementKey: () => key,
      };
      if (value === null) {
        return { ...(acc as any), [key]: routeData };
      }
      return {
        ...(acc as any),
        [key]: {
          ...(loop(value, xPath) as any),
          ...routeData,
        },
      };
    }, {}) as any as RouteTree<T>;
  })(rawTree);
}

export const makeGetPath =
  (path: string) =>
  (queryParams?: IQueryParams): string => {
    const params = queryParams
      ? `?${Object.entries(queryParams)
          .map(x => x.join('='))
          .join('&')}`
      : '';
    return `${path}${params}`;
  };

export function makeStateNode<
  S extends string,
  XS extends S[],
  N extends string,
  T,
>(values: XS, name: N, tree: T): StateNode<XS[number], N, T> {
  return {
    kind: 'state',
    name,
    tree,
    values,
  };
}
