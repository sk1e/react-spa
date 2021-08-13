import { activeLangStateUnit } from './activeLangStateUnit';
import { Lang } from './types';

export function useTranslation(translations: Record<Lang, string>) {
  return translations[activeLangStateUnit.useState()];
}
