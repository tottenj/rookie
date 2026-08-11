import { getAuth } from '@react-native-firebase/auth';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is not configured.');
}

export const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;

  if (user) {
    const idToken = await user.getIdToken();
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});
