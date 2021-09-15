import {
  makeRouteTree,
  makeEnumerationNode,
  makeStringNode,
} from 'utils/RouteTree';

export const routeTree = makeRouteTree(
  makeEnumerationNode(['ru', 'en'], 'LANG', {
    example: null,
    projects: makeStringNode('PROJECT', {
      results: null,
    }),
  }),
);

// console.log('>> route', routeTree.LANG.projects.PROJECT());
