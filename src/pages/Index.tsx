import { Route, Redirect } from 'react-router';

import { routeTree } from './routeTree';

type Props = {};

function Index({}: Props) {
  return (
    <Route path="/" exact>
      <Redirect to={routeTree.en.example.getPath()} />
    </Route>
  );
}

export const Component = Index;
