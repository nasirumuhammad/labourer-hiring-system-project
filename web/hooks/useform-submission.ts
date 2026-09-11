import { useState } from "react";
export const useFormSubmission = () => {
  const [isRedirecting, setIsredirecting] = useState(false);
  const markRedirecting = () => {
    setIsredirecting(true);
  };

  const isBusy = (isSubmitting: boolean) => {
    return isSubmitting || isRedirecting;
  };

  return { markRedirecting, isBusy };
};
