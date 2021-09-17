import React, { useEffect } from 'react';

import { API } from 'services';
import { ProjectListProject } from 'types';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react';

import * as ProjectCard from './ProjectCard';
import './style.scss';

const b = block('project-list');

type Props = {
  getProjectLinkPath(project: ProjectListProject): string;
};

const callStateUnit = API.makeCallStateUnit<ProjectListProject[]>();

function ProjectList({ getProjectLinkPath }: Props) {
  const { call, dataComponentConfigurator } =
    API.services.projectList(callStateUnit);

  const Data = dataComponentConfigurator
    .onSuccess(data =>
      data.map(x => (
        <ProjectCard.Component
          key={x.code}
          project={x}
          getProjectLinkPath={getProjectLinkPath}
        />
      )),
    )
    .getComponent();

  useEffect(() => {
    call({
      data: {
        limit: 50,
        offset: 0,
        filter: {
          langs: ['ru'],
          substring: '',
        },
        sort: {},
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={b()}>
      <Data />
    </div>
  );
}

export const Component = withContextProviders(ProjectList, [
  callStateUnit.ContextProvider,
]);
