import { IComponentInstance } from '@amazon-devices/react-native-kepler';

export interface HeadlessServiceInterface {
  /**
   * This function is called when native service onStart is called.
   */
  onStart(componentInstance: IComponentInstance): Promise<void>;
  /**
   * This function is called when native service onStop is called.
   */
  onStop(componentInstance: IComponentInstance): Promise<void>;
}
