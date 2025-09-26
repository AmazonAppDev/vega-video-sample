import {
  IChangeChannelResponse,
  IChannelHandler,
  OperationError,
} from '@amazon-devices/kepler-channel';
import { EventRegister } from 'react-native-event-listeners';
import { LiveChannelEventPayload } from '../components/navigation/types';

/**
 * A handler that will be provided to ChannelServer to handle Channel commands
 */
const channelTunerHandler: IChannelHandler = {
  async handleChangeChannel(
    matchString: string,
  ): Promise<IChangeChannelResponse> {
    console.info(
      `[ channelTunnelHandler.ts ] - handleChangeChannel -  ktf:Channel - ChangeChannel | ${matchString}`,
    );
    return new Promise<IChangeChannelResponse>((resolve, reject) => {
      const payload: LiveChannelEventPayload = {
        matchString,
        onChannelTuneSuccess: (response: IChangeChannelResponse) => {
          resolve(response);
          console.info(
            `[ channelTunnelHandler.ts ] - onChannelTuneSuccess -  ktf:Channel - ChangeChannel | onChannelTuneSuccess | ${response}`,
          );
        },
        onChannelTuneFailed: (error: OperationError) => {
          reject(error);
          console.error(
            `[ channelTunnelHandler.ts ] - onChannelTuneFailed -  ktf:Channel - ChangeChannel | onChannelTuneFailed | ${error}`,
          );
        },
      };
      EventRegister.emit('LiveChannelEvent', payload);
    });
  },

  /**
   * handleChangeChannelByNumber should not be used, implement and use handleChangeChannel instead
   */
  async handleChangeChannelByNumber(
    _majorNumber: number,
    _minorNumber: number,
  ): Promise<IChangeChannelResponse> {
    throw Error(
      'handleChangeChannelByNumber should not be used, implement and use handleChangeChannel instead',
    );
  },

  async handleSkipChannel(
    channelCount: number,
  ): Promise<IChangeChannelResponse> {
    console.info(`ktf:Channel - SkipChannel | count: ${channelCount}`);
    return new Promise<IChangeChannelResponse>((resolve, reject) => {
      const payload: LiveChannelEventPayload = {
        channelCount,
        onChannelTuneSuccess: (response: IChangeChannelResponse) => {
          resolve(response);
        },
        onChannelTuneFailed: (error: OperationError) => {
          reject(error);
        },
      };
      EventRegister.emit('LiveChannelEvent', payload);
    });
  },
};

export default channelTunerHandler;
