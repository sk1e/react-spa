import { ChartType } from './ChartType';
import { MultilingString } from './MultilingString';

export type GenericWidget<Type extends string, Descriptor> = {
  uuid: string;
  title: MultilingString;
  type: Type;
  descriptor: Descriptor;
};

export type Widget = ChartWidget | MapWidget | DatalistWidget | GalleryWidget;

export type ChartWidget = GenericWidget<'chart', ChartWidgetDescriptor>;
export type MapWidget = GenericWidget<'map', MapWidgetDescriptor>;
export type DatalistWidget = GenericWidget<
  'datalist',
  DataListWidgetDescriptor
>;
export type GalleryWidget = GenericWidget<'gallery', GalleryWidgetDescriptor>;

export type DataListWidgetDescriptor = {};
export type GalleryWidgetDescriptor = {};

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

export type MapWidgetDescriptor = {
  layers: MapLayer[];
};

export type MapLayer = any; // TODO complete

export type FilterRange = {
  from: number;
  to: number;
};

export type UUID = string;

export type ChartWidgetDescriptorFilter = {
  answers: Record<UUID, FilterRange> | null;
};
