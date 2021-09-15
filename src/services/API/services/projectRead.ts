import { Project } from 'types';

import { makeRequest } from './private';

type InputData = {
  code: string;
};

function convert(output: Project): Project {
  return output;
}

export const projectRead = makeRequest<InputData, Project, Project>(
  'project_read',
  'get',
  convert,
);