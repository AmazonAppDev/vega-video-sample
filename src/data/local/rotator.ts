import { RotatorData } from '../../components/rotator/type';
import { REF_APPS_ASSETS_DOMAIN } from '../../utils/videoPlayerValues';
import { tile03, tile09, tile10, tile14 } from './images';

export const getRotator = (): RotatorData[] => [
  {
    id: '169331',
    title: 'Battle of Iron and Blood',
    description:
      'In the ultimate clash between steel and flesh, warriors fight for honor in a brutal medieval conflict.',
    descriptionType: 'Standard MP4 stream for mobile devices',
    duration: '156',
    thumbnailUrl: tile10,
    posterUrl: tile10,
    videoUrl: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing.mp4`,
    categories: ['Hits'],
    channelID: '13455',
    rating: '4',
    releaseDate: '09/20',
  },
  {
    id: '169330',
    title: 'Promises of tomorrow',
    description:
      'Hope emerges from darkness as unlikely heroes fight to secure a better future for humanity.',
    descriptionType: 'Standard MP4 stream for mobile devices',
    duration: '185',
    thumbnailUrl: tile03,
    posterUrl: tile03,
    videoUrl: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing.mp4`,
    categories: ['Hits'],
    channelID: '13453',
    rating: '4',
    releaseDate: '09/20',
  },
  {
    id: '169329',
    title: 'My little girl',
    description:
      "A heartwarming story of innocence and wonder as a father discovers the world through his daughter's eyes.",
    descriptionType: 'Standard MP4 stream for mobile devices',
    duration: '48',
    thumbnailUrl: tile14,
    posterUrl: tile14,
    videoUrl: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing.mp4`,
    categories: ['Hits'],
    channelID: '13454',
    rating: '4',
    releaseDate: '09/20',
  },
  {
    id: '169326111',
    title: 'Ethereal Echoes',
    description:
      'Haunting melodies from another dimension threaten to unravel the fabric of reality itself.',
    descriptionType: 'Standard MP4 stream for mobile devices',
    duration: '156',
    thumbnailUrl: tile09,
    posterUrl: tile09,
    videoUrl: `${REF_APPS_ASSETS_DOMAIN}/boat-sailing.mp4`,
    categories: ['Hits'],
    channelID: '13453111',
    rating: '5',
    releaseDate: '09/20',
  },
];
