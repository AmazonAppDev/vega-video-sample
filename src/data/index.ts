import { RotatorData } from '../components/rotator/type';
import { TitleData } from '../types/TitleData';

export const TestData: () => TitleData[] = () => require('./dynamicData.json');
export const CostaRicaAttractionsData: () => TitleData[] = () =>
  require('./costaRicaAttractions.json');
export const CostaRicaIslandsData: () => TitleData[] = () =>
  require('./costaRicaIslands.json');
export const CostaRicaUnderwaterData: () => TitleData[] = () =>
  require('./costaRicaUnderwater.json');
export const CostaRicaTopRatedData: () => TitleData[] = () =>
  require('./costaRicaTopRated.json');
export const AutoRotatorData: RotatorData[] = require('./rotatorData.json');
