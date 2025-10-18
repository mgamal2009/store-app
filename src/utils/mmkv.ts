import { MMKV } from "react-native-mmkv"

// Don't create it immediately.
let storage: MMKV | null = null

export const getStorage = () => {
  if (!storage) {
    storage = new MMKV()
  }
  return storage
}
