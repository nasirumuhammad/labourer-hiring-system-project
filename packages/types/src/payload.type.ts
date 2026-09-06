import { UserRole } from "@labour-hiring/enums";

export type Payload = {
  jti: string;
  sub: string;
  tokenVersion: number;
  role: UserRole;
};
