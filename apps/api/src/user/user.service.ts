import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebasePrincipal } from '../auth/types/firebase-principal';
import {
  USER_REPOSITORY,
  type UserRepositoryContract,
} from './repository/user.repository.contract';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
  ) {}
  async create(principal: FirebasePrincipal): Promise<unknown> {
    if (!principal.email) {
      throw new BadRequestException(
        'The Firebase account does not have an email address.',
      );
    }

    const existingUser = await this.userRepository.findAuthUserByFirebaseUid(
      principal.firebaseUid,
    );

    if (existingUser) {
      throw new ConflictException(
        'A user account already exists for this Firebase account.',
      );
    }

    return this.userRepository.createUserAccount(
      principal.firebaseUid,
      principal.email,
    );
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    void updateUserDto;
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
