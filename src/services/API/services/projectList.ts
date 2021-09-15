import { ProjectListProject } from 'types';

import { makeRequest } from './private';

type InputData = {
  data: {
    limit: number;
    offset: number;
    filter: {
      langs: string[];
      substring: string;
    };
    sort: {};
  };
};

function convert(output: ProjectListProject[]): ProjectListProject[] {
  return output;
}

export const projectList = makeRequest<
  InputData,
  ProjectListProject[],
  ProjectListProject[]
>('project_list', 'post', convert);
