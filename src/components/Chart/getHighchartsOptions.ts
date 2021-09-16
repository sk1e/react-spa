import {
  PointOptionsObject,
  SeriesPieOptions,
  Options as HighchartsOptions,
  SeriesColumnOptions,
  SeriesScatterOptions,
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
        turboThreshold: 0,
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
          labels: {
            autoRotation: [0],
            autoRotationLimit: 10,
          },
        },
      };
    }

    case 'scatter': {
      const series: SeriesScatterOptions = {
        type: 'scatter',
        showInLegend: false,
        name: '',
        data: data.items.map(
          (x): PointOptionsObject => ({
            name: x.label,
            x: x.x,
            y: x.y,
          }),
        ),
        turboThreshold: 0,
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
          labels: {
            autoRotation: [0],
            autoRotationLimit: 10,
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
