import { ChartData, ChartDataItem, ChartType } from 'types';

import { makeRequest } from './utils';

type APIOutputData = {
  series: SeriesItem[];
  xAxis: XAxis;
};

type SeriesItem = {
  data: SeriesItemData[];
  name: string;
  showInLegend: boolean;
  title: string;
  turboThreshold: number;
};

type SeriesItemData = {
  name: string;
  source: string;
  x: number;
  xcat: string;
  y: number;
  ycat: number;
};

type XAxis = {
  categories: string[];
};

function convertChartData(data: APIOutputData): ChartData {
  return {
    items: data.series[0].data.map(
      (x): ChartDataItem => ({
        label: x.xcat,
        x: x.x,
        y: x.y,
      }),
    ),
  };
}

type InputData = {
  project: string;
  chartType: ChartType;
  xVar: string;
  yVar: string;
  lang: string;
  answers?: Array<Record<string, any>>;
};

export const getChartData = makeRequest<InputData, APIOutputData, ChartData>(
  'get_chart_data',
  'get',
  convertChartData,
);
