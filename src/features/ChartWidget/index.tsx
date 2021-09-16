import React, { useEffect } from 'react';

import { Chart } from 'components';
import { Language } from 'features/global';
import { API } from 'services';
import { ChartData, Project, Widget } from 'types';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import { getXAxisTitle } from './getXAxisTitle';
import './style.scss';

const b = block('chart-widget');

type Props = {
  widget: Widget;
  project: Project;
};

const callStateUnit = API.makeCallStateUnit<ChartData>();

function ChartWidget({ widget, project }: Props) {
  const call = API.services.getChartData(callStateUnit);

  const t = Language.useGetMultilingTranslation();
  const xAxisTitle = getXAxisTitle(project, widget);

  const callState = callStateUnit.useState();
  useEffect(() => {
    const filter =
      widget.descriptor.filter?.answers &&
      Object.entries(widget.descriptor.filter.answers).map(([key, value]) => ({
        [`answers.${key}`]: { $lte: value.to },
      }));

    call({
      project: project.uuid,
      xVar: widget.descriptor.xVar,
      yVar: widget.descriptor.yVar,
      chartType: widget.descriptor.chartType,
      lang: 'ru',
      answers: filter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={b()}>
      {callState.kind === 'successfull' && (
        <Chart.Component
          data={callState.data}
          chartType={widget.descriptor.chartType}
          xAxisTitle={xAxisTitle && t(xAxisTitle)}
        />
      )}
    </div>
  );
}

export const Component = withContextProviders(ChartWidget, [
  callStateUnit.ContextProvider,
]);
