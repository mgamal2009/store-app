import React, {useState} from "react";
import {View, Text, FlatList, RefreshControl} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {useQuery} from "@tanstack/react-query";
import {getProductsByCategory, getCategories} from "../api/products";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function CategoryScreen() {
  const {data: categories} = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories?.[0].name ?? null);
  const [open, setOpen] = useState(false);

  const {data, refetch, isRefetching, isFetching} = useQuery({
    queryKey: ["category", selectedCategory],
    queryFn: () => getProductsByCategory(selectedCategory!),
    enabled: !!selectedCategory, // Only fetch when a category is chosen
  });

  const categoryOptions =
    categories?.map((c: any) => ({
      label: c.name,
      value: c.name,
    })) || [];

  return (
    <View style={{flex: 1, padding: 12, marginTop: useSafeAreaInsets().top}}>
      <Text style={{fontSize: 18, marginBottom: 8}}>Select Category:</Text>

      <DropDownPicker
        open={open}
        value={selectedCategory}
        items={categoryOptions}
        setOpen={setOpen}
        setValue={setSelectedCategory}
        placeholder="Choose a category"
        style={{
          borderColor: "#ccc",
        }}
        containerStyle={{marginBottom: 16}}
        zIndex={1000}
      />

      {selectedCategory && (
        <>
          <Text style={{fontSize: 16, marginBottom: 8}}>
            Showing: {selectedCategory}
          </Text>

          <FlatList
            data={data?.products || []}
            keyExtractor={(i: any) => String(i.id)}
            refreshControl={
              <RefreshControl refreshing={isRefetching || isFetching} onRefresh={refetch}/>
            }
            renderItem={({item}) => (
              <View
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{flex: 1}}>{item.title}</Text>
                <Text>{item.price}$</Text>
              </View>
            )}
            ListEmptyComponent={() =>
              !isFetching && (
                <Text style={{padding: 12}}>No products yet</Text>
              )
            }
          />
        </>
      )}
    </View>
  );
}
