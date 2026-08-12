import { screen, userEvent, waitFor } from '@testing-library/react-native';
import { QueryClient } from '@tanstack/react-query';

import EmailSignUpForm from '../../../features/auth/components/forms/emailSignUpForm/EmailSignUpForm';
import { AuthRepository } from '@/lib/repositories/authRepository/auth.repository';
import { UsersRepository } from '@/lib/repositories/userRepository/UserRepository';
import { createFirebaseUserFixture } from '../../../../test/fixtures/user';
import { renderWithProviders } from '../../../../test/utils/renderWithProviders';

jest.mock('@/lib/repositories/authRepository/auth.repository', () => ({
  AuthRepository: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));

jest.mock('@/lib/repositories/userRepository/UserRepository', () => ({
  UsersRepository: {
    create: jest.fn(),
    getMe: jest.fn(),
    updateMe: jest.fn(),
    deleteMe: jest.fn(),
  },
}));

const mockAuthRepository = jest.mocked(AuthRepository);
const mockUsersRepository = jest.mocked(UsersRepository);

let queryClient: QueryClient | undefined;

async function completeValidSignUpForm() {
  const user = userEvent.setup();

  await user.type(screen.getByTestId('email-input'), 'test@example.com');

  const passwordInput = screen.getByTestId('password-input');
  const confirmPasswordInput = screen.getByTestId('confirmPassword-input');

  await user.type(passwordInput, 'Password123!');
  await user.type(confirmPasswordInput, 'Password123!');

  return user;
}

describe('EmailSignUpForm orchestration', () => {
  beforeEach(() => {
    mockAuthRepository.signUp.mockReset();
    mockUsersRepository.create.mockReset();
  });

  afterEach(() => {
    queryClient?.clear();
    queryClient = undefined;

    jest.restoreAllMocks();
  });

  it('creates the Firebase account and backend profile', async () => {
    const firebaseUser = createFirebaseUserFixture();

    mockAuthRepository.signUp.mockResolvedValue(firebaseUser);
    mockUsersRepository.create.mockResolvedValue(undefined);

    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = await completeValidSignUpForm();

    await user.press(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockAuthRepository.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(mockUsersRepository.create).toHaveBeenCalledWith();
    });

    expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
    expect(firebaseUser.delete).not.toHaveBeenCalled();
  });

  it('does not submit when the email is invalid', async () => {
    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'not-an-email');

    const passwordInputs = screen.getAllByPlaceholderText('Password');

    await user.type(passwordInputs[0]!, 'Password123!');
    await user.type(passwordInputs[1]!, 'Password123!');

    await user.press(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/valid email/i)).toBeTruthy();

    expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('does not submit when the passwords do not match', async () => {
    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');

    const passwordInputs = screen.getAllByPlaceholderText('Password');

    await user.type(passwordInputs[0]!, 'Password123!');
    await user.type(passwordInputs[1]!, 'DifferentPassword123!');

    await user.press(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/passwords do not match/i)).toBeTruthy();

    expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('does not create a backend profile when Firebase signup fails', async () => {
    const firebaseError = Object.assign(new Error('The email address is already in use.'), {
      code: 'auth/email-already-in-use',
    });

    mockAuthRepository.signUp.mockRejectedValue(firebaseError);

    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = await completeValidSignUpForm();

    await user.press(screen.getByTestId('submit-button'));

    expect(await screen.findByText('That email is already registered.')).toBeTruthy();

    expect(mockAuthRepository.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('deletes the Firebase account when backend profile creation fails', async () => {
    const deleteFirebaseUser = jest.fn().mockResolvedValue(undefined);

    const firebaseUser = createFirebaseUserFixture({
      delete: deleteFirebaseUser,
    });

    mockAuthRepository.signUp.mockResolvedValue(firebaseUser);
    mockUsersRepository.create.mockRejectedValue(new Error('Profile creation failed'));

    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = await completeValidSignUpForm();

    await user.press(screen.getByTestId('submit-button'));

    expect(await screen.findByText(/unable|failed|try again/i)).toBeTruthy();

    expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);

    expect(mockUsersRepository.create).toHaveBeenCalledWith();

    expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
    expect(deleteFirebaseUser).toHaveBeenCalledTimes(1);

    expect(mockUsersRepository.create.mock.invocationCallOrder[0]).toBeLessThan(
      deleteFirebaseUser.mock.invocationCallOrder[0]!,
    );
  });

  it('reports the profile error when rollback deletion also fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const rollbackError = new Error('Could not delete Firebase user');

    const deleteFirebaseUser = jest.fn().mockRejectedValue(rollbackError);

    const firebaseUser = createFirebaseUserFixture({
      delete: deleteFirebaseUser,
    });

    mockAuthRepository.signUp.mockResolvedValue(firebaseUser);
    mockUsersRepository.create.mockRejectedValue(new Error('Profile creation failed'));

    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = await completeValidSignUpForm();

    await user.press(
      screen.getByRole('button', {
        name: 'Sign Up',
      }),
    );

    expect(await screen.findByText(/unable|failed|try again/i)).toBeTruthy();

    expect(mockUsersRepository.create).toHaveBeenCalledWith();

    expect(deleteFirebaseUser).toHaveBeenCalledTimes(1);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to delete Firebase user:', rollbackError);

    expect(mockUsersRepository.create.mock.invocationCallOrder[0]).toBeLessThan(
      deleteFirebaseUser.mock.invocationCallOrder[0]!,
    );
  });

  it('prevents repeated submission while signup is pending', async () => {
    let resolveFirebaseUser: ((value: ReturnType<typeof createFirebaseUserFixture>) => void) | undefined;

    mockAuthRepository.signUp.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFirebaseUser = resolve;
        }),
    );

    mockUsersRepository.create.mockResolvedValue(undefined);

    ({ queryClient } = await renderWithProviders(<EmailSignUpForm />));

    const user = await completeValidSignUpForm();

    const submitButton = screen.getByTestId('submit-button');

    await user.press(submitButton);

    await waitFor(() => {
      expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
      expect(submitButton).toBeDisabled();
    });

    await user.press(submitButton);

    expect(mockAuthRepository.signUp).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();

    expect(resolveFirebaseUser).toBeDefined();

    resolveFirebaseUser!(createFirebaseUserFixture());

    await waitFor(() => {
      expect(mockUsersRepository.create).toHaveBeenCalledWith();
      expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
