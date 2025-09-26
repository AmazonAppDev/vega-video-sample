import { getModel } from '@amazon-devices/react-native-device-info';
import { Dimensions, Platform } from 'react-native';

const modelValue = getModel();
/* This model AQVV01P was included because the new simulator Kepler Virtual Device is using this identifier
A refactor for this implementation is required, in order to remove hardcoded values for simulators */
const isSimulator =
  modelValue.includes('simulator') || modelValue.includes('AQVV01P');

const isContentPersonalizationEnabled = () => {
  return !isSimulator && Platform.isTV;
};

const isInAppPurchaseEnabled = () => {
  return Platform.isTV;
};

const isAccountLoginEnabled = () => {
  return Platform.isTV;
};

const isRunningOnAutomotive = () => {
  return !isSimulator && !Platform.isTV;
};

const isRunningOnTVSimulator = () => {
  return modelValue.includes('tv-simulator') && Platform.isTV;
};

const isRunningOnSimulator = () => {
  return isRunningOnAutomotive() || isRunningOnTVSimulator();
};

/*
  Expected outputs for: { isTV: Platform.isTV, model: getModel(), platform: Platform.OS }

  TV SIMULATOR RETURNS {"isTV": true, "model": "tv-simulator", "platform": "kepler"}
  AUTOMOTIVE SIMULATOR RETURNS {"isTV": false, "model": "AQVV01P", "platform": "kepler"}
  CALLIE TV RETURNS {"isTV": true, "model": "AFTCA002", "platform": "kepler"}
*/

/**
 * Based on the device dimensions, we can enable or disable the control of the D-pad.
 *
 * @returns flag to indicate if D-pad controller is supported.
 */
const isDpadControllerSupported = () => {
  if (Dimensions.get('window').width < Dimensions.get('window').height) {
    return false;
  }
  return true;
};

export {
  isContentPersonalizationEnabled,
  isInAppPurchaseEnabled,
  isAccountLoginEnabled,
  isDpadControllerSupported,
  isRunningOnAutomotive,
  isRunningOnTVSimulator,
  isRunningOnSimulator,
};
