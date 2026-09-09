export class ApiError extends Error {
  readonly fieldErrors?: Record<string, string[]>;
  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.fieldErrors = errors;
  }
}
