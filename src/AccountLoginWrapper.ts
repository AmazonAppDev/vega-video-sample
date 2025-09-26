import {
  AccountLoginServerComponent,
  IAccountLoginHandlerAsync,
  IAccountLoginServerAsync,
  IStatus,
  StatusType,
} from '@amazon-devices/kepler-media-account-login';
import { IComponentInstance } from '@amazon-devices/react-native-kepler';
import { store } from './store';

const accountLoginServerComponent = new AccountLoginServerComponent();

export class AccountLoginWrapper {
  m_accountLoginServer?: IAccountLoginServerAsync;
  isSignedIn: boolean = false;

  async updateStatus(loginStatus: boolean) {
    this.isSignedIn = loginStatus;

    try {
      const status = this.getAccountLoginStatus();
      await this.m_accountLoginServer?.updateStatus(status);
    } catch (err) {
      console.error('updateStatus Failed updating login status: ', err);
    }
  }

  getAccountLoginStatus(): IStatus {
    const statusBuilder = accountLoginServerComponent.makeStatusBuilder();
    const appLoginStatus = store.getState().settings.loginStatus;

    statusBuilder.status(
      appLoginStatus ? StatusType.SIGNED_IN : StatusType.SIGNED_OUT,
    );

    return statusBuilder.build();
  }

  createAccountLoginHandler(): IAccountLoginHandlerAsync {
    return {
      handleReadStatus: async (): Promise<IStatus> => {
        console.log('handleReadStatus invoked.');

        return this.getAccountLoginStatus();
      },
    };
  }

  setupAccountLoginServer(componentInstance: IComponentInstance) {
    console.log('setupAccountLoginServer invoked.');
    try {
      this.m_accountLoginServer = accountLoginServerComponent.getOrMakeServer();
    } catch (err) {
      this.m_accountLoginServer = undefined;
      console.error(
        'setupAccountLoginServer failed creating account login server: ',
        err,
      );
      return;
    }

    try {
      this.m_accountLoginServer?.setHandlerForComponent(
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
    // add stop service code here.
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
