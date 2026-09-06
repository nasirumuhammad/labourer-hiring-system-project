export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '***';
  }

  const visibleChars = Math.min(2, localPart.length);
  const maskedLocalPart =
    localPart.slice(0, visibleChars) + '*'.repeat(localPart.length - visibleChars);

  return `${maskedLocalPart}@${domain}`;
}
