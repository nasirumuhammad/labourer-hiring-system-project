import { SigninValues } from "@/components/auth/signin-form";
import { authRequest } from "./api-client";
import { SignupValues } from "@/components/auth/signup-form";

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
}

export const authApi = {
  signin: (payload: SigninValues) =>
    authRequest<TokenPairResponse>("/signin", payload),
  signup: (payload: SignupValues) =>
    authRequest<TokenPairResponse>("/signup", payload),
  signout: () => authRequest<string>("/signout"),
  me: () => authRequest("/me", undefined, "GET"),
  forgotPassword: (payload: { email: string }) =>
    authRequest<string>("/forgot-password", payload),
  verifyOtp: (payload: { email: string; otp: string }) =>
    authRequest<VerifyOtpResponse>("/verify-otp", payload),
  resendOtp: (payload: { email: string }) =>
    authRequest<string>("/resend-otp", payload),
  resetPassword: (payload: { token: string; password: string }) =>
    authRequest<string>("/reset-password", payload),
};
