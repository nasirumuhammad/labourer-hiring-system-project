export const SystemJobs = {
  SEND_FORGOT_PASSWORD_OTP: 'send-forgot-password-otp',
  RESEND_OTP: 'resend-otp',
} as const;

export type SystemJob = (typeof SystemJobs)[keyof typeof SystemJobs];
