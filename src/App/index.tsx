import { MainLayout } from 'features/MainLayout';
import * as RegisterForm from 'features/RegisterForm';
import * as globalFeatures from 'features/global';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react/withContextProviders';

import './App.scss';

const b = block('app');

function App() {
  return (
    <globalFeatures.StyleProvider.Component>
      <div className={b()}>
        <MainLayout>
          <RegisterForm.Component />
        </MainLayout>
      </div>
    </globalFeatures.StyleProvider.Component>
  );
}

export default withContextProviders(App, [
  globalFeatures.SwitchTheme.themeStateUnit.ContextProvider,
  globalFeatures.Language.activeLangStateUnit.ContextProvider,
]);
