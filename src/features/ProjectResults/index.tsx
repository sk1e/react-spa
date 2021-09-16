import React from 'react';

import { Text } from 'components';
import * as widgets from 'features/widgets';
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
      {project.resultWidgets.map(x => {
        switch (x.type) {
          case 'chart':
            return (
              <widgets.Chart.Component
                key={x.uuid}
                widget={x}
                project={project}
              />
            );
          case 'map':
            return <widgets.Map.Component key={x.uuid} widget={x} />;
          case 'datalist':
            return <widgets.Datalist.Component key={x.uuid} widget={x} />;
          case 'gallery':
            return <widgets.Gallery.Component key={x.uuid} widget={x} />;
          default:
            console.error('unknow widget', x);
            return null;
        }
      })}
    </div>
  );
}

export const Component = withContextProviders(ProjectResults, [
  callStateUnit.ContextProvider,
]);
