import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createAuthUserRowFactory } from '../../test/factories/auth/authUserRow.factory';
import { createFirebasePrincipalFactory } from '../../test/factories/auth/firebasePrincipal.factory';
import {
  USER_REPOSITORY,
  type UserRepositoryContract,
} from './repository/user.repository.contract';
import { UserService } from './user.service';

describe('UserService', () => {
  let userRepository: jest.Mocked<
    Pick<
      UserRepositoryContract,
      'findAuthUserByFirebaseUid' | 'createUserAccount'
    >
  >;

  let userService: UserService;

  beforeEach(async () => {
    userRepository = {
      findAuthUserByFirebaseUid: jest.fn(),
      createUserAccount: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get(UserService);
  });

  describe('create', () => {
    it('throws BadRequestException when the Firebase principal has no email', async () => {
      const principal = createFirebasePrincipalFactory({
        email: null,
      });

      const resultPromise = userService.create(principal);

      await expect(resultPromise).rejects.toBeInstanceOf(BadRequestException);
      await expect(resultPromise).rejects.toThrow(
        'The Firebase account does not have an email address.',
      );

      expect(userRepository.findAuthUserByFirebaseUid).not.toHaveBeenCalled();

      expect(userRepository.createUserAccount).not.toHaveBeenCalled();
    });

    it('throws ConflictException when the user already exists', async () => {
      const principal = createFirebasePrincipalFactory();
      const existingUser = createAuthUserRowFactory();

      userRepository.findAuthUserByFirebaseUid.mockResolvedValue(existingUser);

      const resultPromise = userService.create(principal);

      await expect(resultPromise).rejects.toBeInstanceOf(ConflictException);
      await expect(resultPromise).rejects.toThrow(
        'A user account already exists for this Firebase account.',
      );

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(
        principal.firebaseUid,
      );

      expect(userRepository.createUserAccount).not.toHaveBeenCalled();
    });

    it('creates a user when one does not already exist', async () => {
      const principal = createFirebasePrincipalFactory();

      userRepository.findAuthUserByFirebaseUid.mockResolvedValue(null);
      userRepository.createUserAccount.mockResolvedValue(undefined);

      await expect(userService.create(principal)).resolves.toEqual(undefined);

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(
        principal.firebaseUid,
      );

      expect(userRepository.createUserAccount).toHaveBeenCalledTimes(1);

      expect(userRepository.createUserAccount).toHaveBeenCalledWith(
        principal.firebaseUid,
        principal.email,
      );
    });

    it('throws BadRequestException when the email is an empty string', async () => {
      const principal = createFirebasePrincipalFactory({
        email: '',
      });

      const resultPromise = userService.create(principal);

      await expect(resultPromise).rejects.toBeInstanceOf(BadRequestException);
      await expect(resultPromise).rejects.toThrow(
        'The Firebase account does not have an email address.',
      );

      expect(userRepository.findAuthUserByFirebaseUid).not.toHaveBeenCalled();
      expect(userRepository.createUserAccount).not.toHaveBeenCalled();
    });

    it('propagates repository errors while creating a user account', async () => {
      const principal = createFirebasePrincipalFactory();
      const expectedError = new Error('repository write failed');

      userRepository.findAuthUserByFirebaseUid.mockResolvedValue(null);
      userRepository.createUserAccount.mockRejectedValue(expectedError);

      await expect(userService.create(principal)).rejects.toThrow(
        expectedError,
      );

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);
      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(
        principal.firebaseUid,
      );
      expect(userRepository.createUserAccount).toHaveBeenCalledTimes(1);
      expect(userRepository.createUserAccount).toHaveBeenCalledWith(
        principal.firebaseUid,
        principal.email,
      );
    });
  });

  describe('findAll', () => {
    it('returns the expected placeholder response', () => {
      expect(userService.findAll()).toBe('This action returns all user');
    });
  });

  describe('findOne', () => {
    it('returns the expected placeholder response for a user id', () => {
      expect(userService.findOne('abc123')).toBe(
        'This action returns a #abc123 user',
      );
    });
  });

  describe('update', () => {
    it('returns the expected placeholder response for a user id', () => {
      expect(userService.update('abc123', {})).toBe(
        'This action updates a #abc123 user',
      );
    });
  });

  describe('remove', () => {
    it('returns the expected placeholder response for a user id', () => {
      expect(userService.remove('abc123')).toBe(
        'This action removes a #abc123 user',
      );
    });
  });
});
