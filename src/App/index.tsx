import { Text } from 'components';
import { MainLayout } from 'features/MainLayout';
import { StyleProvider } from 'features/StyleProvider';
import { themeStateUnit } from 'features/SwitchTheme';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/withContextProviders';

import './App.scss';

const b = block('app');

function App() {
  return (
    <StyleProvider>
      <div className={b()}>
        <MainLayout>
          <Text.Component>main content</Text.Component>
        </MainLayout>
      </div>
    </StyleProvider>
  );
}

export default withContextProviders(App, [themeStateUnit.ContextProvider]);
