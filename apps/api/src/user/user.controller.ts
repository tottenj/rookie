import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentActor } from '../auth/decorators/current-actor.decorator';
import { type Actor } from '../auth/types/actor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @UseGuards(FirebaseAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @CurrentActor() actor: Actor) {
    return this.userService.create(createUserDto, actor);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
