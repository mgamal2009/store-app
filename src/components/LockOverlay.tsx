import React, {useState} from "react";
import {ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import * as LocalAuthentication from "expo-local-authentication";
import {setLocked, setSession} from "../store/authSlice";
import {setAuthToken} from "../api/client";
import {getStorage} from "../utils/mmkv";

export default function LockOverlay() {
  const isLocked = useSelector((s: RootState) => s.auth.isLocked);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerBiometricAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        setError("Biometrics not available on this device.");
        setLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock App",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        const storage = getStorage();
        const token = storage.getString("token");
        const username = storage.getString("username");
        if (token) {
          setAuthToken(token);
          dispatch(setSession({token, username: username ?? ""}));
          dispatch(setLocked(false));
          storage.set("lastActiveAt", Date.now());
        } else {
          setError("No saved session found.");
        }
      } else {
        setError("Authentication failed or canceled.");
      }
    } catch (err) {
      setError("Biometric error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  if (!token) return null;
  if (!isLocked) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>App Locked</Text>
          <Text style={{marginBottom: 16}}>Authenticate to continue</Text>
          {loading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <TouchableOpacity style={styles.button} onPress={triggerBiometricAuth}>
              <Text>Unlock with Biometrics</Text>
            </TouchableOpacity>
          )}
          {!!error && <Text style={{color: "red", marginTop: 10}}>{error}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center"},
  card: {width: "90%", padding: 20, backgroundColor: "white", borderRadius: 8, alignItems: "center"},
  title: {fontSize: 20, fontWeight: "bold", marginBottom: 8},
  button: {marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: "#eee", alignItems: "center"},
});
