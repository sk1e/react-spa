export type PieChartData = {
  kind: 'pie';
  items: PieChartDataItem[];
};

export type PieChartDataItem = {
  value: number;
  label: string;
};

// export type ChartData = PieChartData;

export type ChartDataItem = {
  x: number;
  y: number;
  label: string;
};

export type ChartData = {
  items: ChartDataItem[];
};
