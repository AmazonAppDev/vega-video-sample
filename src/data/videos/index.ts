import { VideoSource } from '../../types/VideoSource';
import BigBuckBunny from './hls.json';
import TestFootage4K from './mp4.json';
import TearsOfSteel from './mpd.json';
import TearsOfSteelDRM from './mpdDRM.json';

export enum VideoFileTypes {
  MPD = 'MPD',
  HLS = 'HLS',
  MP4 = 'MP4',
  MPD_DRM = 'MPD_DRM',
}

export const DEFAULT_FILE_TYPE: VideoFileTypes = VideoFileTypes.HLS;

export const VideoSources: { [key in VideoFileTypes]: VideoSource } = {
  [VideoFileTypes.MPD]: TearsOfSteel as VideoSource,
  [VideoFileTypes.HLS]: BigBuckBunny as VideoSource,
  [VideoFileTypes.MP4]: TestFootage4K as VideoSource,
  [VideoFileTypes.MPD_DRM]: TearsOfSteelDRM as VideoSource,
};
