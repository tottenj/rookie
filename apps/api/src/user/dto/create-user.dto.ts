import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from '@rookie/shared-types';

export class CreateUserDto extends createZodDto(createUserSchema) {}
