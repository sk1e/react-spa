export interface IQueryParams {
  [param: string]: string;
}

export interface RouteInterface {
  getPath(queryParams?: IQueryParams): string;
  getElementKey(): string;
}

export type RouteTree<T> = T extends EnumerationNode<
  infer S,
  infer Name,
  infer Tree
>
  ? Record<S | Name, RouteTree<Tree> & RouteInterface>
  : T extends StringNode<infer Name, infer Tree>
  ? Record<string, RouteTree<Tree>> &
      Record<Name, RouteTree<Tree> & RouteInterface>
  : T extends null
  ? {}
  : { [P in keyof T]: RouteTree<T[P]> & RouteInterface };

type RawRouteTree = {
  [routeKey: string]:
    | RawRouteTree
    | EnumerationNode<string, string, Record<string, any>>
    | null;
};

type EnumerationNode<
  X extends string,
  N extends string,
  T extends Record<string, any>,
> = {
  kind: 'enumeration';
  values: X[];
  tree: T;
  name: N;
};

type StringNode<N extends string, T extends Record<string, any>> = {
  kind: 'string';
  name: N;
  tree: T;
};

function isEnumerationNode(
  x: any,
): x is EnumerationNode<string, string, Record<string, any>> {
  return (
    (x as EnumerationNode<string, string, Record<string, any>>).kind ===
    'enumeration'
  );
}

function isStringNode(x: any): x is StringNode<string, Record<string, any>> {
  return (x as StringNode<string, Record<string, any>>).kind === 'string';
}

type Tree =
  | null
  | Record<string, any>
  | EnumerationNode<string, string, Record<string, any>>
  | StringNode<string, Record<string, any>>;

export function makeRouteTree<
  T extends RawRouteTree | EnumerationNode<string, string, Record<string, any>>,
>(rawTree: T): RouteTree<T> {
  return (function loop(tree: Tree, path: string[] = []): Record<string, any> {
    const formattedPath = `/${path.join('/')}`;

    const routeData: RouteInterface = {
      getPath: makeGetPath(formattedPath),
      getElementKey: () => path[path.length - 1],
    };

    if (tree === null) {
      return routeData;
    }

    if (isEnumerationNode(tree)) {
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

    if (isStringNode(tree)) {
      return new Proxy(
        {
          ...routeData,
          [tree.name]: (() => {
            const xPath = [...path, `:${tree.name.toLowerCase()}`];
            return loop(tree.tree, xPath);
          })(),
        },
        {
          get: (target, prop: string) => {
            if (prop in target) {
              return target[prop as keyof typeof target];
            }

            const xPath = [...path, prop];
            return loop(tree.tree, xPath);
          },
        },
      );
    }

    return Object.entries(tree).reduce((acc: any, [key, value]) => {
      const xPath = [...path, key];
      return {
        ...acc,
        [key]: loop(value, xPath),
      };
    }, routeData);
  })(rawTree) as any as RouteTree<T>;
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

export function makeEnumerationNode<
  S extends string,
  XS extends S[],
  N extends string,
  T,
>(values: XS, name: N, tree: T): EnumerationNode<XS[number], N, T> {
  return {
    kind: 'enumeration',
    name,
    tree,
    values,
  };
}

export function makeStringNode<T, N extends string>(
  name: N,
  tree: T,
): StringNode<N, T> {
  return {
    kind: 'string',
    name,
    tree,
  };
}
