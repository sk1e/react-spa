import React, { useCallback } from 'react';
import { Route, generatePath } from 'react-router';

import * as MainLayout from 'features/MainLayout';
import * as ProjectList from 'features/ProjectList';
import { Language } from 'features/global';
import { ProjectListProject } from 'types';
import { block } from 'utils/classname';

import { routeTree } from '../routeTree';
import './style.scss';

const b = block('projects');

type Props = {};

function Projects({}: Props) {
  const lang = Language.activeLangStateUnit.useState();

  const getProjectLinkPath = useCallback(
    (project: ProjectListProject) => {
      const projectID = project.code.replaceAll('_', '-');
      return generatePath(
        routeTree.LANG.projects[projectID].results.getPath(),
        { lang },
      );
    },
    [lang],
  );

  return (
    <Route path={routeTree.LANG.projects.getPath()} exact>
      <MainLayout.Component>
        <ProjectList.Component getProjectLinkPath={getProjectLinkPath} />
      </MainLayout.Component>
    </Route>
  );
}

export const Component = React.memo(Projects) as typeof Projects;
