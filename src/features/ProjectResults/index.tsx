import React, { useEffect } from 'react';

import { Chart } from 'components';
import * as ChartWidget from 'features/ChartWidget';
import { API } from 'services';
import { ChartData, Project } from 'types';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import './style.scss';

const b = block('project-results');

type Props = {
  project: Project;
};

const callStateUnit = API.makeCallStateUnit<ChartData>();

function ProjectResults({ project }: Props) {
  return (
    <div className={b()}>
      {project.resultWidgets
        .filter(x => x.type === 'chart')
        .map(x => (
          <ChartWidget.Component
            key={x.uuid}
            widget={x}
            projectID={project.uuid}
          />
        ))}
    </div>
  );
}

export const Component = withContextProviders(ProjectResults, [
  callStateUnit.ContextProvider,
]);
