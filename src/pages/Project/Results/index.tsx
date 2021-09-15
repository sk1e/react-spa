import React from 'react';
import { Route } from 'react-router';

import * as MainLayout from 'features/MainLayout';
import * as ProjectResults from 'features/ProjectResults';
import { Project } from 'types';

import { routeTree } from '../../routeTree';

type Props = {
  project: Project;
};

function Results({ project }: Props) {
  return (
    <Route path={routeTree.LANG.projects.PROJECT.results.getPath()} exact>
      <MainLayout.Component>
        <ProjectResults.Component project={project} />
      </MainLayout.Component>
    </Route>
  );
}

export const Component = React.memo(Results) as typeof Results;
