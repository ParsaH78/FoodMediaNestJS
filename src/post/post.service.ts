import { PostDto, RateDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, postData: PostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          ...postData,
          userId: userId,
          ingredients: postData.ingredients as unknown as Prisma.JsonArray,
          likes: [],
          rating: [],
        },
      });
      return post;
    } catch (error) {
      error.subject = 'error in creating post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePost(postData: UpdatePostDto, id: string) {
    const data: any = postData;
    try {
      const post = await this.prisma.post.update({
        where: {
          id: id,
        },
        data: data,
      });
      return post;
    } catch (error) {
      error.subject = 'error in updating post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deletePost(id: string) {
    try {
      const post = await this.prisma.post.delete({ where: { id: id } });
      return post;
    } catch (error) {
      error.subject = 'error in deleting post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getPost(id: string) {
    try {
      const post = await this.prisma.post.findFirst({ where: { id: id } });
      return post;
    } catch (error) {
      error.subject = 'error in getting post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUsersPost(id: string) {
    try {
      const post = await this.prisma.post.findMany({ where: { userId: id } });
      return post;
    } catch (error) {
      error.subject = "error in getting user's post";
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getTimelinePosts(id: string) {
    try {
      const { followings } = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          followings: true,
        },
      });

      const posts = await this.prisma.post.findMany({});
      // eslint-disable-next-line prefer-const
      let timeline = [];
      for (const post of posts) {
        if (followings.includes(post.userId)) {
          timeline.push(post);
        }
      }
      return timeline;
    } catch (error) {
      error.subject = 'error in getting timeline post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async likeStuff(id: string, postId: string) {
    try {
      const { likes } = await this.prisma.post.findFirst({
        where: { id: postId },
      });
      if (likes.includes(id)) {
        return this.dislikePost(id, postId, likes);
      } else {
        return this.likePost(id, postId);
      }
    } catch (error) {
      error.subject = "error in getting post's likes";
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async likePost(id: string, postId: string) {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            push: id,
          },
        },
      });
      return post.likes;
    } catch (error) {
      error.subject = 'error in liking post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async dislikePost(id: string, postId: string, likes: string[]) {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: likes.filter((like: string) => like !== id),
        },
      });
      return post.likes;
    } catch (error) {
      error.subject = 'error in disliking post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async ratePost(userId: string, postId: string, rate: number) {
    const newRate: RateDto = {
      userId: userId,
      rate: rate,
    };

    try {
      const { rating } = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { rating: true },
      });
      this.removeRate(userId, postId, rating);
    } catch (error) {
      error.subject = 'error in getting post rate';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return this.addRate(postId, newRate);
  }

  async removeRate(userId: string, postId: string, rating: Prisma.JsonValue[]) {
    rating.forEach(async (rate: any) => {
      for (const key in rate) {
        if (key === 'userId' && rate[key] === userId) {
          try {
            await this.prisma.post.update({
              where: {
                id: postId,
              },
              data: {
                rating: rating.filter((rate: any) => rate.userId !== userId),
              },
            });
          } catch (error) {
            error.subject = 'error in removing rate post';
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          }
        }
      }
    });
  }

  async addRate(postId: string, newRate: RateDto) {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          rating: {
            push: newRate as unknown as Prisma.JsonValue,
          },
        },
      });
      return post.rating;
    } catch (error) {
      error.subject = 'error in rating post';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getPostScore(postId: string) {
    try {
      let score = 0;
      const post = await this.prisma.post.findFirst({ where: { id: postId } });
      post.rating.forEach(async (rate: any) => {
        for (const key in rate) {
          if (key === 'rate') {
            score += rate[key];
          }
        }
      });
      return score / post.rating.length;
    } catch (error) {
      error.subject = 'error in getting post store';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
