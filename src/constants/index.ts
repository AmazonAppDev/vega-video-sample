import { COLORS } from '../styles/Colors';

export enum DPADEventType {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
  PLAY = 'play',
  PAUSE = 'pause',
  PLAYPAUSE = 'playpause',
  SKIPBACKWARD = 'skip_backward',
  SKIPFORWARD = 'skip_forward',
  SELECT = 'select',
  MENU = 'menu',
  BACK = 'back',
  PAGE_UP = 'page_up',
  PAGE_DOWN = 'page_down',
  PAGE_LEFT = 'page_left',
  PAGE_RIGHT = 'page_right',
  INFO = 'info',
  MORE = 'more',
}

export const NetworkStatus = {
  CONNECTED: 'Connected',
  NOT_CONNECTED: 'Not Connected',
};

export const LoginStatus = {
  SIGNED_IN: true,
  SIGNED_OUT: false,
};

export const EVENT_KEY_DOWN = 0;
export const EVENT_KEY_UP = 1;

export const MAX_NARROW_SCREEN_WIDTH = 1300;

export const CAPTION_DISABLE_TEXT = 'Off';
export const CAPTION_DISABLE_ID = '-1';
export const L2_GRADIENT_COLORS = [
  `${COLORS.PALE_GRAY}99`,
  `${COLORS.MEDIUM_GRAY}99`,
  COLORS.CHARCOAL_GRAY,
];
export enum ReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

export const ErrorMsg =
  'An error occurred while playing the video, please try again later.';
