import React from 'react';
import { Route } from 'react-router';

import { routeTree } from '../routeTree';
import * as Content from './Content';

type Props = {};

function Project({}: Props) {
  return (
    <Route path={routeTree.LANG.projects.PROJECT.getPath()}>
      <Content.Component />
    </Route>
  );
}

export const Component = React.memo(Project) as typeof Project;
