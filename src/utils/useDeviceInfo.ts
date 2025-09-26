import {
  getApplicationName,
  getBaseOs,
  getDeviceType,
  getManufacturer,
  getModel,
  getSystemName,
  getVersion,
} from '@amazon-devices/react-native-device-info';
import { useCallback, useEffect, useRef, useState } from 'react';

type DeviceInfoApi = {
  applicationName: string;
  modelName: string;
  systemName: string;
  versionName: string;
  deviceType: string;
  baseOS: string;
  manufacturer: string;
};

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchDeviceInfo = useCallback(async () => {
    if (deviceInfo || !isMounted.current) {
      return;
    }

    try {
      const deviceInfoApiValues: DeviceInfoApi = {
        applicationName: getApplicationName(),
        modelName: getModel(),
        systemName: getSystemName(),
        versionName: getVersion(),
        deviceType: getDeviceType(),
        baseOS: await getBaseOs(),
        manufacturer: await getManufacturer(),
      };
      if (isMounted.current) {
        setDeviceInfo(deviceInfoApiValues);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching device info:', error);
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [deviceInfo]);

  return { deviceInfo, isLoading, fetchDeviceInfo };
};
