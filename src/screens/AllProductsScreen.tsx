import React from "react";
import {FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteProduct, getProducts} from "../api/products";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {clearSession} from "../store/authSlice";
import {setAuthToken} from "../api/client";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {getStorage} from "../utils/mmkv";

export default function AllProductsScreen() {
  const queryClient = useQueryClient();
  const {data, isLoading, refetch, isRefetching} = useQuery({queryKey: ["products"], queryFn: getProducts});
  const username = useSelector((s: RootState) => s.auth.username);
  const isSuperadmin = username === "emilys";
  const dispatch = useDispatch();

  const onDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old?.products) return old;
        return {...old, products: old.products.filter((p: any) => p.id !== id)};
      });
    } catch (e) {
      alert("Delete failed");
    }
  };

  const onSignOut = () => {
    const storage = getStorage();
    storage.delete("token");
    storage.delete("username");
    setAuthToken(undefined);
    dispatch(clearSession());
  };

  return (
    <View style={{flex: 1, marginTop: useSafeAreaInsets().top}}>
      <View style={styles.header}>
        <Text style={{fontSize: 18}}>All Products</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={{color: "red"}}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.products || []}
        keyExtractor={(item: any) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Image source={{uri: item.thumbnail}} style={styles.thumb}/>
            <Text style={{flex: 1}}>{item.title}</Text>
            {isSuperadmin && (
              <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.delete}>
                <Text>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={() => (isLoading ? <Text>Loading...</Text> : <Text>No products</Text>)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  row: {flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderColor: "#eee"},
  thumb: {width: 60, height: 60, marginRight: 12, borderRadius: 6},
  delete: {padding: 8, backgroundColor: "#fdd", borderRadius: 6},
});
