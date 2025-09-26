import { TitleData } from './TitleData';

export type MovieGridData = {
  heading: string;
  testID: string;
  data: () => TitleData[];
};
