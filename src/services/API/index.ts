// import { Series } from 'highcharts';
import { makePrimaryUnit, PrimaryStateUnit } from 'utils/State';

import { CallState } from './types';

export { services } from './services';

export function makeCallStateUnit<T>(): PrimaryStateUnit<CallState<T>> {
  return makePrimaryUnit<CallState<T>>({ kind: 'initial' });
}
