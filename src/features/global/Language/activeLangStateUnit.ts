import { useHistory, useRouteMatch, generatePath } from 'react-router';

import { Language } from 'types';
import { AbstractStateUnit } from 'utils/State';

type LangUnit = AbstractStateUnit<Language> & {
  useSetState(): (lang: Language) => void;
};

export const activeLangStateUnit: LangUnit = {
  addSubscriber: () => {
    throw Error('not implemented');
  },
  initialState: 'ru',
  useID: () => 'lang',
  useGetState: () => {
    throw Error('not implemented');
  },
  useState: (): Language => {
    const match = useRouteMatch<{ lang: Language }>();
    return match.params.lang;
  },
  useSetState: (): ((lang: Language) => void) => {
    const match = useRouteMatch<{ lang: Language }>();
    const history = useHistory();

    return (lang: Language) => {
      const res = generatePath(match.path, { lang });
      history.replace(res);
    };
  },
};
