import { ChartType } from './ChartType';
import { MultilingString } from './MultilingString';

export type Widget = ChartWidget;

export type ChartWidget = {
  uuid: string;
  type: 'chart';
  descriptor: ChartWidgetDescriptor;
};

export type ChartWidgetDescriptor = {
  title: MultilingString;
  chartType: ChartType;
  xVar: string;
  xVarType: string;
  yVar: string;
  yVarType: string;
  seriesVar: string;
  colorScheme: string;
  filter?: ChartWidgetDescriptorFilter;
  options?: Partial<{
    shrinkCat: boolean;
    shrinkCatLimit: number;
    shrinkCatShow: boolean;
    shrinkCatTitle: MultilingString;
  }>;
};

export type FilterRange = {
  from: number;
  to: number;
};

export type UUID = string;

export type ChartWidgetDescriptorFilter = {
  answers: Record<UUID, FilterRange> | null;
};
