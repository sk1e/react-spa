import { Language } from './Language';

export type MultilingStringElement = {
  lang: Language;
  value: string;
};
export type MultilingString = MultilingStringElement[];
