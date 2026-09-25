import { UserRole } from "@labour-hiring/enums";
import { UserProfile } from "@labour-hiring/types";

export type UserResponse = {
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  profile: UserProfile;
};
