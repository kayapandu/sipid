import { useState, useEffect, useCallback } from 'react';
import DeviceInfo from 'react-native-device-info';

const useDevice = () => {
  const {
    getBaseOs,
    getBrand,
    getDevice,
    getDeviceId,
    getDeviceName,
    getDeviceType,
    getDisplay,
    getHardware,
  } = DeviceInfo;
  const [deviceInfo, setDeviceInfo] = useState({});

  const getOs = useCallback(async () => {
    const baseOs = await getBaseOs();
    const brand = await getBrand();
    const device = await getDevice();
    const deviceId = getDeviceId();
    const deviceName = await getDeviceName();
    const deviceType = getDeviceType();
    const display = await getDisplay();
    const hardware = await getHardware();

    setDeviceInfo({
      baseOs,
      brand,
      device,
      deviceId,
      deviceName,
      deviceType,
      display,
      hardware,
    });

  }, [getBaseOs, getBrand, getDevice, getDeviceId, getDeviceName, getDeviceType, getDisplay, getHardware]);

  useEffect(() => {
    getOs();
  }, [getOs]);

  return {
    deviceInfo,
  };
};

export default useDevice;
