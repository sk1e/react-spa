import {
  PointOptionsObject,
  SeriesPieOptions,
  Options as HighchartsOptions,
  SeriesColumnOptions,
} from 'highcharts';

import { ChartData, ChartType } from 'types';

type Args = {
  data: ChartData;
  type: ChartType;
  xAxisTitle?: string;
};

export function getHighchartOptions({
  data,
  type,
  xAxisTitle,
}: Args): HighchartsOptions {
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
        title: {
          text: '',
        },
        series: [series],
      };
    }

    case 'column': {
      const series: SeriesColumnOptions = {
        type: 'column',
        showInLegend: false,
        data: data.items.map(
          (x): PointOptionsObject => ({
            name: x.label,
            x: x.x,
            y: x.y,
          }),
        ),
      };

      return {
        title: {
          text: '',
        },
        series: [series],
        xAxis: {
          title: {
            text: xAxisTitle,
          },
          type: 'category',
          angle: 180,
          labels: {
            autoRotation: [0],
            autoRotationLimit: 10,
            staggerLines: 0,
          },
        },
      };
    }

    default: {
      console.error('unexpected chart type', type);
      return {};
    }
  }
}
