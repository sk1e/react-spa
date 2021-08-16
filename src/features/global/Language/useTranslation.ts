import { Language } from 'types';

import { activeLangStateUnit } from './activeLangStateUnit';

export function useTranslation(translations: Record<Language, string>) {
  return translations[activeLangStateUnit.useState()];
}
