import { UserRole } from "@labour-hiring/enums";
import { UserProfile } from "./profile.type";

export type User = {
  id: string;

  email: string;

  role: UserRole;

  tokenVersion: number;

  createdAt: Date;

  updatedAt: Date;

  profile: UserProfile;
};
