import { makeRouteTree, makeStateNode } from 'utils/RouteTree';

export const routeTree = makeRouteTree(
  makeStateNode(['ru', 'en'], 'LANG', { example: null }),
);
