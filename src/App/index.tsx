import { Text } from 'components';
import { MainLayout } from 'features/MainLayout';
import * as globalFeatures from 'features/global';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/withContextProviders';

import './App.scss';

const b = block('app');

function App() {
  const mainContextText = globalFeatures.Language.useTranslation({
    en: 'main content',
    ru: 'основное содержимое',
  });

  return (
    <globalFeatures.StyleProvider.Component>
      <div className={b()}>
        <MainLayout>
          <Text.Component>{mainContextText}</Text.Component>
        </MainLayout>
      </div>
    </globalFeatures.StyleProvider.Component>
  );
}

export default withContextProviders(App, [
  globalFeatures.SwitchTheme.themeStateUnit.ContextProvider,
  globalFeatures.Language.activeLangStateUnit.ContextProvider,
]);
