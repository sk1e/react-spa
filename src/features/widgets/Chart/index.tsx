import React, { useEffect } from 'react';

import { Chart } from 'components';
import { Language } from 'features/global';
import { API } from 'services';
import { ChartData, Project, ChartWidget } from 'types';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import * as WidgetLayout from '../WidgetLayout';
import { getXAxisTitle } from './getXAxisTitle';
import './style.scss';

const b = block('chart-widget');

type Props = {
  widget: ChartWidget;
  project: Project;
};

const callStateUnit = API.makeCallStateUnit<ChartData>();

function ChartWidgetComponent({ widget, project }: Props) {
  const call = API.services.getChartData(callStateUnit);

  const t = Language.useGetMultilingTranslation();
  const xAxisTitle = getXAxisTitle(project, widget);

  const callState = callStateUnit.useState();
  useEffect(() => {
    const filter = widget.descriptor.filter?.answers
      ? Object.entries(widget.descriptor.filter.answers).map(
          ([key, value]) => ({
            [`answers.${key}`]: { $lte: value.to },
          }),
        )
      : undefined;

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
    <WidgetLayout.Component className={b()} widget={widget}>
      {callState.kind === 'successfull' && (
        <Chart.Component
          data={callState.data}
          chartType={widget.descriptor.chartType}
          xAxisTitle={xAxisTitle && t(xAxisTitle)}
        />
      )}
    </WidgetLayout.Component>
  );
}

export const Component = withContextProviders(ChartWidgetComponent, [
  callStateUnit.ContextProvider,
]);
