import { Language } from 'types';
import { makePrimaryUnit } from 'utils/State';

export const activeLangStateUnit = makePrimaryUnit<Language>('ru');
