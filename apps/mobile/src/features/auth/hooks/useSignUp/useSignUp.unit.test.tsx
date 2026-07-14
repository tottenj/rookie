// useSignUp.test.ts
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useSignUp } from "./useSignUp";
import { AuthRepository } from "@/lib/repositories/authRepository/auth.repository";
import { UsersRepository } from "@/lib/repositories/userRepository/UserRepository";
import { mapAuthError } from "@/lib/errors/mapAuthErrors/mapAuthErrors";
import QueryClientWrapper, { createTestQueryClient } from "../../../../lib/test/utils/QueryClientWrapper";
import { QueryClient } from "@tanstack/react-query";

jest.mock("@/lib/repositories/authRepository/auth.repository");
jest.mock("@/lib/repositories/userRepository/UserRepository");
jest.mock("@/lib/errors/mapAuthErrors/mapAuthErrors");

const mockedAuth = AuthRepository as jest.Mocked<typeof AuthRepository>;
const mockedUsers = UsersRepository as jest.Mocked<typeof UsersRepository>;
const mockedMapAuthError = mapAuthError as jest.Mock;

const validInput = { email: "a@b.com", password: "password123", confirmPassword: "password123" };

describe("useSignUp", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("returns firebaseUser and profile on success", async () => {
    const firebaseUser = { uid: "123", email: validInput.email, delete: jest.fn() };
    mockedAuth.signUp.mockResolvedValue(firebaseUser as any);
    mockedUsers.create.mockResolvedValue({ uid: "123", email: validInput.email } as any);
    const { result } = await renderHook(() => useSignUp(), { wrapper: QueryClientWrapper });
    await act(async () => {
      await result.current.signUpAsync(validInput);
    });
    expect(mockedAuth.signUp).toHaveBeenCalledWith({ email: validInput.email, password: validInput.password });
    expect(mockedUsers.create).toHaveBeenCalledWith({ email: validInput.email });
    expect(firebaseUser.delete).not.toHaveBeenCalled();
  });

  it("does not attempt delete if signUp itself fails", async () => {
    mockedAuth.signUp.mockRejectedValue(new Error("bad credentials"));
    const { result } = await renderHook(() => useSignUp(), { wrapper: QueryClientWrapper });
    await act(async () => {
      await expect(result.current.signUpAsync(validInput)).rejects.toThrow("bad credentials");
    });
    expect(mockedUsers.create).not.toHaveBeenCalled();
  });

  it("rolls back firebase user if profile creation fails", async () => {
    const firebaseUser = { uid: "123", email: validInput.email, delete: jest.fn().mockResolvedValue(undefined) };
    mockedAuth.signUp.mockResolvedValue(firebaseUser as any);
    const profileError = new Error("profile create failed");
    mockedUsers.create.mockRejectedValue(profileError);
    const { result } = await renderHook(() => useSignUp(), { wrapper: QueryClientWrapper });
    await act(async () => {
      await expect(result.current.signUpAsync(validInput)).rejects.toThrow(profileError);
    });
    expect(firebaseUser.delete).toHaveBeenCalledTimes(1);
  });

  it("still surfaces original error if rollback delete also fails", async () => {
    const deleteError = new Error("delete failed");
    const firebaseUser = { uid: "123", email: validInput.email, delete: jest.fn().mockRejectedValue(deleteError) };
    mockedAuth.signUp.mockResolvedValue(firebaseUser as any);
    const profileError = new Error("profile create failed");
    mockedUsers.create.mockRejectedValue(profileError);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = await renderHook(() => useSignUp(), { wrapper: QueryClientWrapper });
    await act(async () => {
      await expect(result.current.signUpAsync(validInput)).rejects.toThrow(profileError);
    });
    expect(consoleSpy).toHaveBeenCalledWith("Failed to delete Firebase user:", deleteError);
    consoleSpy.mockRestore();
  });

  it("wires errorMessage to mapAuthError with mutation error", async () => {
    mockedAuth.signUp.mockRejectedValue(new Error("boom"));
    mockedMapAuthError.mockReturnValue("Something went wrong");
    const { result } = await renderHook(() => useSignUp(), { wrapper: QueryClientWrapper });
    await act(async () => {
      await result.current.signUpAsync(validInput).catch(() => {});
    });
    await waitFor(() => expect(result.current.errorMessage).toBe("Something went wrong"));
    expect(mockedMapAuthError).toHaveBeenCalledWith(expect.any(Error));
  });
});
