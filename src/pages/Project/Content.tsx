import { useEffect } from 'react';
import { generatePath, Route, useRouteMatch } from 'react-router';

import * as MainLayout from 'features/MainLayout';
import * as ProjectNavigation from 'features/ProjectNavigation';
import { API } from 'services';
import { Project } from 'types';
import { RouteInterface } from 'utils/RouteTree';
import { withContextProviders } from 'utils/react';

import { routeTree } from '../routeTree';
import * as Results from './Results';

type Props = {};

const callStateUnit = API.makeCallStateUnit<Project>();

function ProjectNavigationPanel() {
  const match = useRouteMatch({
    path: routeTree.LANG.projects.PROJECT.getPath(),
  });

  const makeRoute = (route: RouteInterface) =>
    generatePath(route.getPath(), match?.params);

  return (
    <ProjectNavigation.Component
      aboutRoute={makeRoute(routeTree.LANG.projects.PROJECT.about)}
      authorsBlogRoute={makeRoute(routeTree.LANG.projects.PROJECT.authorsBlog)}
      discussionRoute={makeRoute(routeTree.LANG.projects.PROJECT.discussion)}
      findingsRoute={makeRoute(routeTree.LANG.projects.PROJECT.findings)}
      investigationRoute={makeRoute(
        routeTree.LANG.projects.PROJECT.investigation,
      )}
      participantsRoute={makeRoute(
        routeTree.LANG.projects.PROJECT.participants,
      )}
      resourcesRoute={makeRoute(routeTree.LANG.projects.PROJECT.resources)}
    />
  );
}

function Content({}: Props) {
  const { call, dataComponentConfigurator } =
    API.services.projectRead(callStateUnit);
  const match = useRouteMatch<{ project: string }>();

  const code = match.params.project.replace(/-/g, '_');

  useEffect(() => {
    call({ code });
  }, [call, code]);

  const Data = dataComponentConfigurator
    .onSuccess(data => <Results.Component project={data} />)
    .getComponent();

  return (
    <MainLayout.Component SidePanel={ProjectNavigationPanel}>
      <Route path={routeTree.LANG.projects.PROJECT.findings.getPath()}>
        <Data />
      </Route>
    </MainLayout.Component>
  );
}

export const Component = withContextProviders(Content, [
  callStateUnit.ContextProvider,
]);
