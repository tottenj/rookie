import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

import { mapAuthError } from "@/lib/errors/mapAuthErrors/mapAuthErrors";

function createAxiosError(status: number, message: string): AxiosError<{ message: string }> {
  const response: AxiosResponse<{ message: string }> = {
    status,
    statusText: message,
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders(),
    },
    data: {
      message,
    },
  };

  return new AxiosError(
    "Request failed",
    status >= 500 ? "ERR_BAD_RESPONSE" : "ERR_BAD_REQUEST",
    response.config,
    undefined,
    response,
  );
}

describe("mapAuthError", () => {
  describe("Firebase Auth errors", () => {
    it.each([
      {
        code: "auth/email-already-in-use",
        expectedMessage: "That email is already registered.",
      },
      {
        code: "auth/invalid-credential",
        expectedMessage: "Incorrect email or password.",
      },
      {
        code: "auth/invalid-email",
        expectedMessage: "Please enter a valid email address.",
      },
      {
        code: "auth/weak-password",
        expectedMessage: "Please choose a stronger password.",
      },
      {
        code: "auth/user-disabled",
        expectedMessage: "This account has been disabled.",
      },
      {
        code: "auth/user-not-found",
        expectedMessage: "No account found with that email.",
      },
      {
        code: "auth/wrong-password",
        expectedMessage: "Incorrect email or password.",
      },
    ])("maps $code to the correct message", ({ code, expectedMessage }) => {
      expect(mapAuthError({ code })).toBe(expectedMessage);
    });

    it("returns a generic message for an unknown Firebase Auth error", () => {
      expect(mapAuthError({ code: "auth/unknown-error" })).toBe("Something went wrong. Please try again.");
    });
  });

  describe("backend errors", () => {
    it("maps a 409 response to an account-exists message", () => {
      const error = createAxiosError(409, "Conflict");
      expect(mapAuthError(error)).toBe("That account already exists.");
    });

    it("returns the backend message for a 400 response", () => {
      const error = createAxiosError(400, "Email is required.");

      expect(mapAuthError(error)).toBe("Email is required.");
    });

    it("returns a server message for an unhandled response status", () => {
      const error = createAxiosError(500, "Internal Server Error");
      expect(mapAuthError(error)).toBe("Couldn't reach the server. Please try again.");
    });

    it("returns a server message when no response is available", () => {
      const error = new AxiosError("Network Error", "ERR_NETWORK");
      expect(mapAuthError(error)).toBe("Couldn't reach the server. Please try again.");
    });
  });

  describe("empty and unsupported values", () => {
    it.each([null, undefined])("returns null for %p", (error) => {
      expect(mapAuthError(error)).toBeNull();
    });

    it.each(["string", 123, true, {}, []])("returns a generic message for unsupported input %p", (error) => {
      expect(mapAuthError(error)).toBe("Something went wrong. Please try again.");
    });
  });
});
