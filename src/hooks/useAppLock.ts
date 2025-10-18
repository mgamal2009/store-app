import * as LocalAuthentication from "expo-local-authentication";
import {useDispatch} from "react-redux";
import {setLocked} from "../store/authSlice";
import {useCallback} from "react";

export function useAppLock() {
  const dispatch = useDispatch();

  const checkBiometricUnlock = useCallback(async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !supported) {
        console.log("No biometrics available");
        return true; // skip lock if no biometrics
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock with biometrics",
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        dispatch(setLocked(false));
        return true;
      } else {
        dispatch(setLocked(true));
        return false;
      }
    } catch (e) {
      console.warn("Biometric error", e);
      dispatch(setLocked(true));
      return false;
    }
  }, []);

  return {checkBiometricUnlock};
}
