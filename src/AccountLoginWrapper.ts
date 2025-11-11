import {
  AccountLoginServerComponent,
  IAccountLoginHandlerAsync,
  IAccountLoginServerAsync,
  IStatus,
  StatusType,
} from '@amazon-devices/kepler-media-account-login';
import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const accountLoginServerComponent = new AccountLoginServerComponent();
const ACCOUNT_LOGIN_STORAGE_KEY = 'LOGIN_STATUS_KEY';

export class AccountLoginWrapper {
  accountLoginServer?: IAccountLoginServerAsync;

  async updateStatus(loginStatus: boolean) {
    try {
      await AsyncStorage.setItem(
        ACCOUNT_LOGIN_STORAGE_KEY,
        JSON.stringify(loginStatus),
      );
    } catch (err) {
      console.error('Failed to write to AsyncStorage', err);
    }

    const status = accountLoginServerComponent
      .makeStatusBuilder()
      .status(loginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT)
      .build();

    try {
      await this.accountLoginServer?.updateStatus(status);
    } catch (err) {
      console.error('updateStatus Failed updating login status: ', err);
    }
  }

  async getAccountLoginStatus(): Promise<IStatus> {
    const statusBuilder = accountLoginServerComponent.makeStatusBuilder();
    const loginStatusString: any = await AsyncStorage.getItem(
      ACCOUNT_LOGIN_STORAGE_KEY,
    );

    if (loginStatusString === null) {
      return statusBuilder.status(StatusType.SIGNED_OUT).build();
    }

    const loginStatus = JSON.parse(loginStatusString);
    return statusBuilder
      .status(loginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT)
      .build();
  }

  createAccountLoginHandler(): IAccountLoginHandlerAsync {
    return {
      handleReadStatus: async (): Promise<IStatus> =>
        this.getAccountLoginStatus(),
    };
  }

  setupAccountLoginServer(componentInstance: IComponentInstance) {
    console.log('setupAccountLoginServer invoked.');
    try {
      this.accountLoginServer = accountLoginServerComponent.getOrMakeServer();
    } catch (err) {
      this.accountLoginServer = undefined;
      console.error(
        'setupAccountLoginServer failed creating account login server: ',
        err,
      );
      return;
    }

    try {
      this.accountLoginServer?.setHandlerForComponent(
        this.createAccountLoginHandler(),
        componentInstance,
      );
    } catch (err) {
      console.error('setupAccountLoginServer failed to set handler: ', err);
    }
    console.log('setupAccountLoginServer completed.');
  }

  onStart(componentInstance: IComponentInstance): Promise<void> {
    console.info('AccountLoginWrapper onStart()');
    this.setupAccountLoginServer(componentInstance);
    return Promise.resolve();
  }

  onStop(): Promise<void> {
    console.info('AccountLoginWrapper onStop()');
    return Promise.resolve();
  }
}

export const AccountLoginWrapperInstance = new AccountLoginWrapper();

export const onStartService = (
  componentInstance: IComponentInstance,
): Promise<void> => {
  return AccountLoginWrapperInstance.onStart(componentInstance);
};

export const onStopService = (): Promise<void> => {
  return AccountLoginWrapperInstance.onStop();
};
