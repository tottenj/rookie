import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { FirebasePrincipal } from '../auth/types/firebase-principal';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(principal: FirebasePrincipal) {
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    void updateUserDto;
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
