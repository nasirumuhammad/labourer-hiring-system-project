export const SystemEvents = {
  SEND_FORGOT_PASSWORD_RESET_TOKEN: 'auth.forgot-password.reset-token-issued',
} as const;

export class ForgotPasswordResetTokenEventPayload {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}
