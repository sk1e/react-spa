import { makePrimaryUnit } from 'utils/State';

import { Lang } from './types';

export const activeLangStateUnit = makePrimaryUnit<Lang>('ru');
