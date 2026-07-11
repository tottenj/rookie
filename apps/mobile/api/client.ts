// apps/mobile/api/client.ts
import { getAuth } from "@react-native-firebase/auth";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL!,
});

apiClient.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    const idToken = await user.getIdToken(true); // Firebase SDK auto-refreshes if stale
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});
