import {
  makeRouteTree,
  makeEnumerationNode,
  makeStringNode,
} from 'utils/RouteTree';

export const routeTree = makeRouteTree(
  makeEnumerationNode(['ru', 'en'], 'LANG', {
    example: null,
    projects: makeStringNode('PROJECT', {
      about: null,
      investigation: null,
      findings: null,
      discussion: null,
      authorsBlog: null,
      resources: null,
      participants: null,
    }),
  }),
);

// console.log('>> route', routeTree.LANG.projects.PROJECT());
