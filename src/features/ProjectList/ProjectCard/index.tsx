import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Text, Button } from 'components';
import { ProjectListProject } from 'types';
import { block } from 'utils/classname';

import './style.scss';

const b = block('project-card');

type Props = {
  project: ProjectListProject;
  getProjectLinkPath(project: ProjectListProject): string;
};

function ProjectCard({ project, getProjectLinkPath }: Props) {
  return (
    <Link to={getProjectLinkPath(project)}>
      <Button.Component type="button" className={b()} variant="text">
        <img src={project.thumb.large} className={b('image')} alt="thumb" />
        <Text.Component typography="heading-m">
          {project.title[0].value}
        </Text.Component>
      </Button.Component>
    </Link>
  );
}

export const Component = React.memo(ProjectCard) as typeof ProjectCard;
