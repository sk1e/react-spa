import { useEffect } from 'react';
import { Route, useRouteMatch } from 'react-router';

import { API } from 'services';
import { Project } from 'types';
import { withContextProviders } from 'utils/react';

import { routeTree } from '../routeTree';
import * as Results from './Results';

type Props = {};

const callStateUnit = API.makeCallStateUnit<Project>();

function Content({}: Props) {
  const call = API.services.projectRead(callStateUnit);
  const match = useRouteMatch<{ project: string }>();

  const code = match.params.project.replace(/-/g, '_');

  const projectRequest = callStateUnit.useState();

  useEffect(() => {
    call({ code });
  }, [call, code]);

  return (
    <Route path={routeTree.LANG.projects.PROJECT.results.getPath()}>
      {projectRequest.kind === 'successfull' && (
        <Results.Component project={projectRequest.data} />
      )}
    </Route>
  );
}

export const Component = withContextProviders(Content, [
  callStateUnit.ContextProvider,
]);
