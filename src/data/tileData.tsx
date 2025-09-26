import { TitleData } from '../types/TitleData';
import { REF_APPS_ASSETS_DOMAIN } from '../utils/videoPlayerValues';

export const tileData: TitleData = {
  id: '169313',
  title: 'Beautiful Whale Tail Uvita Costa Rica',
  description: 'Beautiful Whale Tail Uvita Costa Rica',
  duration: 86,
  thumbnail:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  posterUrl:
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg',
  uri: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing.mp4`,
  thumbnailUrl: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing-hd/`,
  categories: ['Costa Rica Islands'],
  channelID: '13454',
  mediaType: 'video',
  mediaSourceType: 'url',
  format: 'MP4',
  secure: false,
  uhd: false,
  rentAmount: '100',
} as TitleData;
