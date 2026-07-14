import { AuthRepository } from "@/lib/repositories/authRepository/auth.repository";
import { QueryClient } from "@tanstack/react-query";
import { screen, userEvent } from "@testing-library/react-native";
import { renderWithProviders } from "../../../../test/utils/renderWithProviders";
import EmailSignInForm from "@/features/auth/components/forms/emailSignInForm/EmailSignInForm";

jest.mock("@/lib/repositories/authRepository/auth.repository", () => ({
  AuthRepository: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));

const mockAuthRepository = jest.mocked(AuthRepository);

let queryClient: QueryClient | undefined;

async function completeValidSignInForm() {
  const user = userEvent.setup();
  await user.type(screen.getByTestId("email-input"), "test@example.com");
  await user.type(screen.getByTestId("password-input"), "Password123!");
  return user;
}

describe("EmailSignInForm orchestration", () => {
  beforeEach(() => {
    mockAuthRepository.signIn.mockReset();
  });

  afterEach(() => {
    queryClient?.clear();
    queryClient = undefined;

    jest.restoreAllMocks();
  });

  it("calls the signIn function with the correct data", async () => {
    ({ queryClient } = await renderWithProviders(<EmailSignInForm />));
    const user = await completeValidSignInForm();

    await user.press(screen.getByTestId("submit-button"));

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123!",
    }, expect.any(Object));
  });

  it("displays an error message when signIn fails", async () => {
    mockAuthRepository.signIn.mockRejectedValueOnce(
      Object.assign(new Error("Invalid credentials"), {
        code: "auth/invalid-credential",
      }),
    );
    ({ queryClient } = await renderWithProviders(<EmailSignInForm />));

    const user = await completeValidSignInForm();
    await user.press(screen.getByTestId("submit-button"));

    expect(await screen.findByText("Incorrect email or password.")).toBeTruthy();
  });


  it("displays a generic error message when signIn fails with an unknown error", async () => {
    mockAuthRepository.signIn.mockRejectedValueOnce(new Error("Unknown error"));
    ({ queryClient } = await renderWithProviders(<EmailSignInForm />));

    const user = await completeValidSignInForm();
    await user.press(screen.getByTestId("submit-button"));

    expect(await screen.findByText("Something went wrong. Please try again.")).toBeTruthy();
  });
});
