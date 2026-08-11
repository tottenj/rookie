// apps/mobile/api/users/users.repository.ts
import { apiClient } from '../../../../api/client';
import { AppUser, CreateUser } from '@rookie/shared-types';

export type UpdateUserDto = Partial<{
  displayName: string;
  avatarUrl: string;
}>;

export const UsersRepository = {
  create: async (): Promise<void> => {
    await apiClient.post<void>('/user');
  },

  getMe: async (): Promise<AppUser> => {
    const res = await apiClient.get<AppUser>('/users/me');
    return res.data;
  },

  updateMe: async (data: UpdateUserDto): Promise<AppUser> => {
    const res = await apiClient.patch<AppUser>('/users/me', data);
    return res.data;
  },

  deleteMe: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },
};
