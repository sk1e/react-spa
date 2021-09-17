import React from 'react';

import { Language } from 'features/global';
import { Translations } from 'types';
import { block } from 'utils/classname';

import * as NavLink from './NavLink';
import './style.scss';

const b = block('project-navigation');

type Props = {
  aboutRoute: string;
  investigationRoute: string;
  findingsRoute: string;
  discussionRoute: string;
  authorsBlogRoute: string;
  resourcesRoute: string;
  participantsRoute: string;
};

type ProjectNavigationLink =
  | 'about'
  | 'investigation'
  | 'findings'
  | 'discussion'
  | 'resources'
  | 'authorsBlog'
  | 'participants';

const translations: Record<ProjectNavigationLink, Translations> = {
  about: {
    en: 'About',
    ru: 'Информация',
  },
  investigation: {
    en: 'Investigation',
    ru: 'Исследование',
  },
  findings: {
    en: 'Findings',
    ru: 'Результаты',
  },
  discussion: {
    en: 'Discussion',
    ru: 'Обсуждение',
  },
  authorsBlog: {
    en: "Author's Blog",
    ru: 'Дневник исследователя',
  },
  resources: {
    en: 'Resources',
    ru: 'Медиатека',
  },
  participants: {
    en: 'Participants',
    ru: 'Участники',
  },
};

function ProjectNavigation(props: Props) {
  const lang = Language.activeLangStateUnit.useState();

  const getText = (navLink: ProjectNavigationLink) =>
    translations[navLink][lang];

  return (
    <nav className={b()}>
      <NavLink.Component to={props.aboutRoute}>
        {getText('about')}
      </NavLink.Component>

      <NavLink.Component to={props.investigationRoute}>
        {getText('investigation')}
      </NavLink.Component>

      <NavLink.Component to={props.findingsRoute}>
        {getText('findings')}
      </NavLink.Component>

      <NavLink.Component to={props.discussionRoute}>
        {getText('discussion')}
      </NavLink.Component>

      <NavLink.Component to={props.authorsBlogRoute}>
        {getText('authorsBlog')}
      </NavLink.Component>

      <NavLink.Component to={props.resourcesRoute}>
        {getText('resources')}
      </NavLink.Component>

      <NavLink.Component to={props.participantsRoute}>
        {getText('participants')}
      </NavLink.Component>
    </nav>
  );
}

export const Component = React.memo(
  ProjectNavigation,
) as typeof ProjectNavigation;
