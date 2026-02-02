import { toast } from "react-hot-toast";

const unsafePattern = /[<>/"'&]/;
const replacePattern = /[<>/"'&]/g;

export function sanitizeInput(value: string): string {
  if (unsafePattern.test(value)) {
    toast.error("That character is not allowed");
    return value.replace(replacePattern, "");
  }
  return value;
}
