import { userFavoritesDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Controller, Get, Put, Delete, UseGuards, Body } from '@nestjs/common';
import { JWTGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { updateUserDto } from './dto';

@UseGuards(JWTGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Put('update')
  updateUser(@Body() dto: updateUserDto, @GetUser('id') userId: string) {
    return this.userService.updateUser(userId, dto);
  }

  @Delete('delete')
  deleteUser(@GetUser('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Put('favorite')
  updateUserFavorites(
    @GetUser('id') userId: string,
    @Body() data: userFavoritesDto,
  ) {
    return this.userService.updateUserFavorites(userId, data['postId']);
  }

  @Put('follow')
  followUser(
    @GetUser('id') userId: string,
    @Body() data: { targetId: string },
  ) {
    return this.userService.followUser(userId, data['targetId']);
  }
}
