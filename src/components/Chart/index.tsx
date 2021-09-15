import { chart } from 'highcharts';
import { useEffect, useRef } from 'react';
import React from 'react';

import { ChartData } from 'types';
import { block } from 'utils/classname';

import { getHighchartOptions } from './getHighchartsOptions';
import './style.scss';

const b = block('chart');

type Props = {
  data: ChartData;
};

function Chart({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const options = getHighchartOptions(data, 'pie');

      chart(ref.current, options);
    }
  }, [data]);

  return <div className={b()} ref={ref} />;
}

export const Component = React.memo(Chart);
