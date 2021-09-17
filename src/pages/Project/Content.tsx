import { useEffect } from 'react';
import { Route, useRouteMatch } from 'react-router';

import * as MainLayout from 'features/MainLayout';
import { API } from 'services';
import { Project } from 'types';
import { withContextProviders } from 'utils/react';

import { routeTree } from '../routeTree';
import * as Results from './Results';

type Props = {};

const callStateUnit = API.makeCallStateUnit<Project>();

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
    <MainLayout.Component>
      <Route path={routeTree.LANG.projects.PROJECT.results.getPath()}>
        <Data />
      </Route>
    </MainLayout.Component>
  );
}

export const Component = withContextProviders(Content, [
  callStateUnit.ContextProvider,
]);
