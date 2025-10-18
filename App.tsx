import React, {useEffect, useRef} from "react";
import {Provider as ReduxProvider, useDispatch, useSelector} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import {QueryClientProvider} from "@tanstack/react-query";
import {persist, queryClient} from "./src/utils/queryClient";
import {RootState, store} from "./src/store";
import RootNavigator from "./src/navigation/RootNavigator";
import {AppState, AppStateStatus, View} from "react-native";
import {setLastActive, setLocked, setSession} from "./src/store/authSlice";
import {setAuthToken} from "./src/api/client";
import OfflineBanner from "./src/components/OfflineBanner";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useAppLock} from "./src/hooks/useAppLock";
import {getStorage} from "./src/utils/mmkv";
import LockOverlay from "./src/components/LockOverlay";

const AppInner = () => {
  const dispatch = useDispatch();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const {checkBiometricUnlock} = useAppLock();
  const {token, isLocked} = useSelector((state: RootState) => state.auth);

  // Lock when background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appState.current.match(/active/) && next.match(/inactive|background/)) {
        dispatch(setLocked(true));
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [dispatch]);

  useEffect(() => {
    persist();
  }, []);

  // ⏱️ Inactivity lock
  useEffect(() => {
    if (!token || isLocked) return;

    const storage = getStorage();
    const LOCK_TIMEOUT = 10_000; // 10 seconds

    let lockTimer: number | null = null;

    const resetTimer = () => {
      if (lockTimer) clearTimeout(lockTimer);
      const now = Date.now();
      storage.set("lastActiveAt", now);
      lockTimer = setTimeout(() => {
        dispatch(setLocked(true));
      }, LOCK_TIMEOUT);
    };

    // Start timer immediately
    resetTimer();

    (globalThis as any).resetLockTimer = resetTimer;

    return () => {
      if (lockTimer) clearTimeout(lockTimer);
      delete (globalThis as any).resetLockTimer;
    };
  }, [dispatch, token, isLocked]);

  // 🔐 Restore token & ask for biometrics
  useEffect(() => {
    const storage = getStorage();
    const token = storage.getString("token");
    const username = storage.getString("username");
    const didJustLogin = storage.getBoolean("justLoggedIn");

    if (token && !didJustLogin) {
      (async () => {
        const success = await checkBiometricUnlock();
        if (success) {
          setAuthToken(token);
          dispatch(setSession({token, username: username ?? ""}));
          dispatch(setLastActive());
        } else {
          dispatch(setLocked(true));
        }
      })();
    }

    storage.delete("justLoggedIn");
  }, [dispatch, checkBiometricUnlock]);

  const handleInteraction = () => {
    const storage = getStorage();
    const now = Date.now();
    storage.set("lastActiveAt", now);

    // Reset the timeout immediately if it exists
    if ((globalThis as any).resetLockTimer) {
      (globalThis as any).resetLockTimer();
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <View style={{flex: 1}} onTouchStart={handleInteraction}>
            <OfflineBanner/>
            <RootNavigator/>
            <LockOverlay/>
          </View>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppInner/>
    </ReduxProvider>
  );
}
