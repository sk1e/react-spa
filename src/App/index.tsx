import { Route } from 'react-router';

import * as globalFeatures from 'features/global';
import * as pages from 'pages';
import { routeTree } from 'pages/routeTree';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react/withContextProviders';

import './App.scss';

const b = block('app');

function App() {
  const pagesList = Object.values(pages);
  return (
    <globalFeatures.StyleProvider.Component>
      <div className={b()}>
        <Route path={routeTree.LANG.getPath()}>
          {pagesList.map((Page, index) => (
            <Page.Component key={index} />
          ))}
        </Route>
      </div>
    </globalFeatures.StyleProvider.Component>
  );
}

export default withContextProviders(App, [
  globalFeatures.SwitchTheme.themeStateUnit.ContextProvider,
  globalFeatures.IDProvider.Component,
]);
