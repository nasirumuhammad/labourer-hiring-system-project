import { ProfileFormValues } from "@/components/profile/profile-form";
import { apiClient } from "@/lib/api/api-client";
import { UserResponse } from "@/types/user";
import { User } from "@labour-hiring/types";

export const profileApi = {
  get: () => apiClient.get<User>("/profile"),

  create: (payload: ProfileFormValues) =>
    apiClient.post<UserResponse>("/profile", payload),

  update: (payload: Partial<ProfileFormValues>) =>
    apiClient.update<UserResponse>("/profile", payload),
};
