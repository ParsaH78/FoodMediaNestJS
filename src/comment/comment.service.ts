import { CommentDto } from './dto/comment.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async commentPost(id: string, postId: string, text: string) {
    const newComment: CommentDto = {
      userId: id,
      postId: postId,
      text: text,
    };
    try {
      const comment = await this.prisma.comment.create({
        data: newComment,
      });
      return comment;
    } catch (error) {
      return { error: 'error in adding comment \n' + error };
    }
  }

  async deleteComment(commentId: string) {
    try {
      const comment = await this.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return comment;
    } catch (error) {
      return { error: 'error in deleting comment \n' + error };
    }
  }

  async editComment(userId: string, text: string, commentId: string) {
    const currentComment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    const updateComment: CommentDto = {
      postId: currentComment.postId,
      userId: userId,
      text: text,
    };

    try {
      const comment = await this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: updateComment,
      });
      return comment;
    } catch (error) {
      return { error: 'error in editing comment \n' + error };
    }
  }
}
