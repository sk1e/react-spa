import { Route } from 'react-router';

import * as Examples from 'features/Examples';
import * as MainLayout from 'features/MainLayout';
import * as SelectExample from 'features/SelectExample';
import { routeTree } from 'pages/routeTree';
import { withContextProviders } from 'utils/react';

import './style.scss';

type Props = {};

function Example({}: Props) {
  return (
    <Route path={routeTree.LANG.example.getPath()} exact>
      <MainLayout.Component TabPanel={SelectExample.Component}>
        <Examples.Component
          useActiveExample={SelectExample.activeExampleStateUnit.useState}
        />
      </MainLayout.Component>
    </Route>
  );
}

export const Component = withContextProviders(Example, [
  SelectExample.activeExampleStateUnit.ContextProvider,
]);
