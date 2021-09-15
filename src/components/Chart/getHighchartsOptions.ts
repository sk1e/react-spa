import {
  PointOptionsObject,
  SeriesPieOptions,
  Options as HighchartsOptions,
  SeriesHistogramOptions,
} from 'highcharts';

import { ChartData, ChartType } from 'types';

type ChartKind = 'pie' | 'histogram';

export function getHighchartOptions(
  data: ChartData,
  type: ChartKind,
): HighchartsOptions {
  switch (type) {
    case 'pie': {
      const sum = data.items.reduce((acc, x) => acc + x.y, 0);
      const series: SeriesPieOptions = {
        type: 'pie',
        name: '',
        dataLabels: {
          formatter: function () {
            const percentage = (
              ((this.point.y || 0) / sum) *
              100
            ).toLocaleString(undefined, { maximumFractionDigits: 1 });
            return `${percentage}%<br/>${this.point.name}`;
          },
        },
        data: data.items.map(
          (x): PointOptionsObject => ({
            name: x.label,
            x: x.x,
            y: x.y,
          }),
        ),
      };

      return {
        series: [series],
      };
    }
    case 'histogram': {
      const series: SeriesHistogramOptions = {
        type: 'histogram',
        baseSeries: 1,
      };

      return {
        series: [series],
      };
    }
  }
}
