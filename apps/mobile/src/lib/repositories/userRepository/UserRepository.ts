// apps/mobile/api/users/users.repository.ts

import { apiClient } from "../../../../api/client";


export type CreateUserDto = {
  uid: string;
  email: string | null;
};

export type UpdateUserDto = Partial<{
  displayName: string;
  avatarUrl: string;
  // ...whatever fields your backend profile supports
}>;

export type User = {
  id: string;
  uid: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export const UsersRepository = {
  create: async (data: CreateUserDto): Promise<User> => {
    const res = await apiClient.post<User>("/users", data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>("/users/me");
    return res.data;
  },

  updateMe: async (data: UpdateUserDto): Promise<User> => {
    const res = await apiClient.patch<User>("/users/me", data);
    return res.data;
  },

  deleteMe: async (): Promise<void> => {
    await apiClient.delete("/users/me");
  },
};
