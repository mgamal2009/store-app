import {QueryClient} from "@tanstack/react-query";
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";
import {persistQueryClient} from "@tanstack/react-query-persist-client";
import {getStorage} from "./mmkv";

export const createMMKVQueryPersister = () => {
  const storage = getStorage()

  return createSyncStoragePersister({
    storage: {
      getItem: (key) => {
        const v = storage.getString(key);
        return v === undefined ? null : v;
      },
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  })
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // cacheTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
});

export function persist() {
  persistQueryClient({
    queryClient,
    persister: createMMKVQueryPersister(),
    maxAge: 1000 * 60 * 60 * 24, // 24h
  });
}
