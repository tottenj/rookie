// apps/mobile/lib/errors/mapAuthError.ts
import { isAxiosError } from "axios";

export function mapAuthError(error: unknown): string | null {
  if (!error) return null;


   if (isAxiosError(error)) {
     const status = error.response?.status;
     const backendMessage = error.response?.data?.message;
     if (status === 409) return "That account already exists.";
     if (status === 400 && typeof backendMessage === "string") return backendMessage;
     return "Couldn't reach the server. Please try again.";
   }

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "That email is already registered.";
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Please choose a stronger password.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "No account found with that email.";
      case "auth/wrong-password":
        return "Incorrect email or password.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  // NestJS backend errors via axios: { response: { status, data: { message } } }
 

  return "Something went wrong. Please try again.";
}
