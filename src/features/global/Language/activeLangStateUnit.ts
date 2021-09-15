import { useHistory, useRouteMatch, generatePath } from 'react-router';

import { Language } from 'types';
import { AbstractStateUnit, SetState } from 'utils/State';

type LangUnit = AbstractStateUnit<Language> & {
  useSetState(): SetState<Language>;
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
    // TODO perf, subcsribe to route changes and notify only on language change
    const match = useRouteMatch<{ lang: Language }>();
    return match.params.lang;
  },
  useSetState: (): SetState<Language> => {
    const match = useRouteMatch<{ lang: Language }>();
    const history = useHistory();

    return ((lang: Language) => {
      const res = generatePath(match.path, { ...match.params, lang });
      history.replace(res);
    }) as SetState<Language>; // TODO add full implementation
  },
};
