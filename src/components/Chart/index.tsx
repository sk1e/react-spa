import { chart } from 'highcharts';
import { useEffect, useRef } from 'react';
import React from 'react';

import { ChartData, ChartType } from 'types';
import { block } from 'utils/classname';

import { getHighchartOptions } from './getHighchartsOptions';
import './style.scss';

const b = block('chart');

type Props = {
  data: ChartData;
  chartType: ChartType;
  xAxisTitle?: string;
};

function Chart({ data, chartType, xAxisTitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const options = getHighchartOptions({
        data,
        type: chartType,
        xAxisTitle,
      });

      chart(ref.current, options);
    }
  }, [chartType, data, xAxisTitle]);

  return <div className={b()} ref={ref} />;
}

export const Component = React.memo(Chart);
