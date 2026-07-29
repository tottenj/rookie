import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { type FirebasePrincipal } from '../auth/types/firebase-principal';
import { RequireAppUser } from '../auth/decorators/route/require-app-user.decorator';
import { CurrentPrincipal } from '../auth/decorators/current-principle.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@CurrentPrincipal() principal: FirebasePrincipal) {
    return this.userService.create(principal);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @RequireAppUser()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
