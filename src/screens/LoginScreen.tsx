import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useDispatch} from "react-redux";
import {setSession} from "../store/authSlice";
import {loginApi} from "../api/auth";
import {setAuthToken} from "../api/client";
import {getStorage} from "../utils/mmkv";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      const storage = getStorage();
      storage.set("token", res.accessToken);
      storage.set("username", username);
      storage.set("justLoggedIn", true);
      setAuthToken(res.accessToken);

      dispatch(setSession({token: res.accessToken, username}));
    } catch (e: any) {
      alert("Login failed: " + (e?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Login</Text>
      <TextInput placeholder="Username" autoCapitalize={"none"} value={username} onChangeText={setUsername} style={styles.input}
                 placeholderTextColor={"#b1b1b1"}/>
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
                 style={styles.input} placeholderTextColor={"#b1b1b1"}/>
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={{color: "white"}}>{loading ? "Logging..." : "Login"}</Text>
      </TouchableOpacity>
      <Text style={{marginTop: 16}}>
        Tip: use <Text style={{fontWeight: "bold"}}>emilys</Text> as username and <Text
        style={{fontWeight: "bold"}}>emilyspass</Text> as password to enable delete.
      </Text>
      <Text style={{marginTop: 8}}>
        Tip: use <Text style={{fontWeight: "bold"}}>averyp</Text> as username and <Text
        style={{fontWeight: "bold"}}>averyppass</Text> as password to sign in as user.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: "center", padding: 20},
  title: {fontSize: 22, marginBottom: 16},
  input: {borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginTop: 8, color: "#000"},
  button: {backgroundColor: "#333", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12},
});
