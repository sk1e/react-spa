import { Question } from './Question';
import { Widget } from './Widget';

export type Project = {
  resultWidgets: Widget[];
  questions: Question[];
  uuid: string;
};
