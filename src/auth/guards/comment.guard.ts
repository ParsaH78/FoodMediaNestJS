/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const prisma = new PrismaClient();
    const user = request.user;
    const data = request.params;

    const post = await prisma.post.findFirst({ where: { id: data.postId }, select: { userId: true } });

    if (user.id !== post.userId) {
      return false;
    } else {
      return true;
    }

  }
}
