import React, { useEffect } from 'react';

import { Chart } from 'components';
import { API } from 'services';
import { ChartData, Widget } from 'types';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import './style.scss';

const b = block('chart-widget');

type Props = {
  widget: Widget;
  projectID: string;
};

const callStateUnit = API.makeCallStateUnit<ChartData>();

function ChartWidget({ widget, projectID }: Props) {
  const call = API.services.getChartData(callStateUnit);

  const callState = callStateUnit.useState();

  useEffect(() => {
    call({
      project: projectID,
      xVar: widget.descriptor.xVar,
      yVar: widget.descriptor.yVar,
      chartType: 'pie',
      lang: 'ru',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={b()}>
      {callState.kind === 'successfull' && (
        <Chart.Component data={callState.data} />
      )}
    </div>
  );
}

export const Component = withContextProviders(ChartWidget, [
  callStateUnit.ContextProvider,
]);
