import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = (): NetInfoState | null => {
  const [netStatus, setNetStatus] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetStatus(state);
    });

    NetInfo.fetch().then(setNetStatus);

    return () => unsubscribe();
  }, []);

  return netStatus;
};

