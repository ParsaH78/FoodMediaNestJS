import { updateUserDto } from './dto/user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: string, dto: updateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });

      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;

      return user;
    } catch (error) {
      throw new HttpException(error.message[0], HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: string) {
    try {
      await this.prisma.user.delete({ where: { id: id } });
      return { message: 'User has been deleted' };
    } catch (error) {
      throw new HttpException(error.message[0], HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserFavorites(userId: string, postId: string) {
    const { favorites } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favorites: true,
      },
    });

    if (favorites.length > 0) {
      return await this.addToFavorites(userId, postId, favorites);
    }

    return await this.removeFromFavorites(userId, postId);
  }

  async addToFavorites(userId: string, postId: string, favorites: string[]) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorites: {
            set: favorites.filter((item) => item !== postId),
          },
        },
      });
      return user.favorites;
    } catch (error) {
      throw new HttpException(error.message[0], HttpStatus.BAD_REQUEST);
    }
  }

  async removeFromFavorites(userId: string, postId: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorites: {
            push: postId,
          },
        },
      });
      return user.favorites;
    } catch (error) {
      throw new HttpException(error.message[0], HttpStatus.BAD_REQUEST);
    }
  }

  async followingStuff(userId: string, targetId: string) {
    if (userId === targetId)
      throw new HttpException(
        "you can't follow yourself !",
        HttpStatus.FORBIDDEN,
      );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { followings: true },
    });
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { followers: true },
    });

    if (!target)
      throw new HttpException('Target does not exist', HttpStatus.FORBIDDEN);

    if (user.followings.includes(targetId))
      return await this.unFollowUser(userId, targetId);

    return await this.followUser(userId, user, targetId, target);
  }

  async followUser(
    userId: string,
    user: { followings: string[] },
    targetId: string,
    target: { followers: string[] },
  ) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        followings: {
          set: user.followings.filter((item) => item !== targetId),
        },
      },
    });

    await this.prisma.user.update({
      where: {
        id: targetId,
      },
      data: {
        followers: {
          set: target.followers.filter((item) => item !== userId),
        },
      },
    });
    return updatedUser.followings;
  }

  async unFollowUser(userId: string, targetId: string) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        followings: {
          push: targetId,
        },
      },
    });
    await this.prisma.user.update({
      where: {
        id: targetId,
      },
      data: {
        followers: {
          push: userId,
        },
      },
    });
    return user.followings;
  }
}
