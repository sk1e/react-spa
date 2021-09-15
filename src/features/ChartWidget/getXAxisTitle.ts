import { Project, Widget } from 'types';
import { MultilingString } from 'types/MultilingString';

const regex = /Fact\.(.+)/;

export function getXAxisTitle(
  project: Project,
  widget: Widget,
): MultilingString | undefined {
  const match = regex.exec(widget.descriptor.xVar);

  if (match) {
    return project.questions.find(x => x.uuid === match[1])?.title;
  }
}
