import { IMediaSessionId, ITimeValue } from '@amazon-devices/kepler-media-controls';
import {
  KeplerMediaControlHandler,
  VideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';
import { SKIP_INTERVAL_SECONDS } from './videoPlayerValues';

// You can override as many method from KeplerMediaControlHandler class as needed.
// Below code demonstrate overriding a few of them
export class AppOverrideMediaControlHandler extends KeplerMediaControlHandler {
  private videoPlayer: VideoPlayer | null = null;
  private clientOverrideNeeded: boolean = false;
  private static SEEK_BACKWARD: number = -SKIP_INTERVAL_SECONDS;
  private static SEEK_FORWARD: number = SKIP_INTERVAL_SECONDS;

  constructor(videoPlayer: VideoPlayer, overrideNeeded: boolean) {
    super();
    this.videoPlayer = videoPlayer;
    this.clientOverrideNeeded = overrideNeeded;
  }

  async handlePlay(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        '[AppOverrideMediaControlHandler.ts] - managed media control callback for handlePlay()',
      );
      this.videoPlayer?.play();
    } else {
      // Let it be handled by the default handler
      console.log(
        '[AppOverrideMediaControlHandler.ts] default media control callback for handlePlay()',
      );
      super.handlePlay(mediaSessionId);
    }
  }
  async handlePause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        'AppOverrideMediaControlHandler managed media control callback for handlePause()',
      );
      this.videoPlayer?.pause();
    } else {
      // Let it be handled by the default handler
      console.log(
        'AppOverrideMediaControlHandler default media control callback for handlePause()',
      );
      super.handlePause(mediaSessionId);
    }
  }
  async handleStop(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        'AppOverrideMediaControlHandler managed media control callback for handleStop()',
      );
      this.videoPlayer?.pause();
    } else {
      // Let it be handled by the default handler
      console.log(
        'AppOverrideMediaControlHandler default media control callback for handleStop()',
      );
      super.handleStop(mediaSessionId);
    }
  }
  async handleTogglePlayPause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        'AppOverrideMediaControlHandler managed media control callback for handleTogglePlayPause()',
      );
      if (this.videoPlayer?.paused) {
        console.log('Player is in paused state hence initiate play command');
        this.videoPlayer?.play();
      } else {
        console.log('Player is in playing state hence initiate pause command');
        this.videoPlayer?.pause();
      }
    } else {
      // Let it be handled by the default handler
      console.log(
        'AppOverrideMediaControlHandler default media control callback for handleTogglePlayPause()',
      );
      super.handleTogglePlayPause(mediaSessionId);
    }
  }
  async handleStartOver(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        'AppOverrideMediaControlHandler managed media control callback for handleStartOver()',
      );
      this.videoPlayer!.currentTime = 0;
      this.videoPlayer?.play();
    } else {
      // Let it be handled by the default handler
      console.log(
        'AppOverrideMediaControlHandler default media control callback for handleStartOver()',
      );
      super.handleStartOver(mediaSessionId);
    }
  }
  async handleFastForward(mediaSessionId?: IMediaSessionId) {
    console.log(
      'AppOverrideMediaControlHandler disable any fast forward interaction, it is handled with seek bar callbacks. mediaSessionId: ',
      mediaSessionId,
    );
  }
  async handleRewind(mediaSessionId?: IMediaSessionId) {
    console.log(
      'AppOverrideMediaControlHandler disable any fast rewind interaction, it is handled with seek bar callbacks. mediaSessionId: ',
      mediaSessionId,
    );
  }
  async handleSeek(position: ITimeValue, mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      console.log(
        'AppOverrideMediaControlHandler managed media control callback for handleSeek()',
      );
      super.handleSeek(position, mediaSessionId);
    } else {
      // Let it be handled by the default handler
      console.log(
        'AppOverrideMediaControlHandler default media control callback for handleSeek()',
      );
      super.handleSeek(position, mediaSessionId);
    }
  }
}
