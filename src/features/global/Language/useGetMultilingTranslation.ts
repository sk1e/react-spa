import { MultilingString } from 'types/MultilingString';

import { activeLangStateUnit } from './activeLangStateUnit';

export function useGetMultilingTranslation() {
  const lang = activeLangStateUnit.useState();

  return (str: MultilingString): string => {
    const translation = str.find(x => x.lang === lang)?.value;

    if (translation) {
      return translation;
    }

    console.warn('no translation in', str, 'for lang', lang);

    return str.find(x => x.lang === 'ru')?.value || str[0]?.value || '';
  };
}
