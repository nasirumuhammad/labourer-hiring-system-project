export const SystemEvents = {
  SEND_FORGOT_PASSWORD_RESET_TOKEN: 'auth.forgot-password.reset-token-issued',
  RESEND_FORGOT_PASSWORD_OTP: 'auth.forgot-password.otp-resend-requested',
} as const;

export class ForgotPasswordResetTokenEventPayload {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}
