import { SigninValues } from "@/components/auth/signin-form";
import { authRequest } from "./api-client";
import { SignupValues } from "@/components/auth/signup-form";

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  signin: (payload: SigninValues) =>
    authRequest<TokenPairResponse>("/signin", payload),
  signup: (payload: SignupValues) =>
    authRequest<TokenPairResponse>("/signup", payload),
  signout: () => authRequest<string>("/signout"),
  me: () => authRequest("/me"),
};
