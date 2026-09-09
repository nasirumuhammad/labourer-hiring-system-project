import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "./api/api-error";

export function applyFieldError<T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
): boolean {
  if (!error.fieldErrors) return false;
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    setError(field as Path<T>, { message: messages[0] });
  }
  return true;
}
