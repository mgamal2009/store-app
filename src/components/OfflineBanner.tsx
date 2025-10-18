import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {useSafeAreaInsets} from "react-native-safe-area-context"

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => sub();
  }, []);
  if (isOnline) return null;
  return (
    <View style={{backgroundColor: "orange", padding: 8, marginTop: useSafeAreaInsets().top}}>
      <Text style={{color: "white"}}>Offline — showing cached data</Text>
    </View>
  );
}
