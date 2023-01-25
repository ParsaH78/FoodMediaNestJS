/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const prisma = new PrismaClient();
    const user = request.user;
    const param = request.params;
    let data: any;

    if (param.id) {
      data = await prisma.post.findFirst({ where: { id: param.postId }, select: { userId: true } });
    } else {
      data = await prisma.comment.findFirst({ where: { id: param.postId }, select: { userId: true } });
    }

    if (user.id !== data.userId) {
      return false;
    } else {
      return true;
    }

  }
}
