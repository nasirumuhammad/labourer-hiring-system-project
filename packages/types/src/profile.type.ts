import { IdentityType } from "./identity-type.type";

export type UserProfile = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  lga: string;
  address: string;
  identityType: IdentityType;
  identityNumber: string;
  bankName: string;
  bankAccountNumber: string;
};
