import { PostDto, UpdatePostDto } from './dto/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, RequestMapping } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async createPost(userId: string, postData: PostDto) {
        let ingredients: any[] = []
        ingredients = postData.ingredients;
        try {
            const post = await this.prisma.post.create({
                data: {
                    userId: userId,
                    name: postData.name,
                    desc: postData.desc,
                    ingredients: ingredients as Prisma.JsonArray,
                    readytime: postData.readytime,
                    images: postData.images,
                    category: postData.category,
                    likes: [],
                    rating: []
                }
            })
            return post;
        } catch (error) {
            return {"error": "error in creating post \n" + error};
        }
    }

    async updatePost(userId: string, postData: UpdatePostDto, id: string) {
        const post = await this.prisma.post.findFirst({where: {id: id}});
        if (post.userId !== userId) {
            return {error: "you cannot update this post"};
        }
        const data: any = postData
        try {
            const post = await this.prisma.post.update({
                where: {
                    id: id
                },
                data: data
            })
            return post;
        } catch (error) {
            return {"error": "error in updating post \n" + error};
        }
    }

    async deletePost(userId: string, id: string) {
        const post = await this.prisma.post.findFirst({where: {id: id}});
        if (post.userId !== userId) {
            return {error: "you cannot delete this post"};
        }
        try {
            const post = await this.prisma.post.delete({where: {id: id}});
            return post;
        } catch (error) {
            return {"error": "error in deleting post \n" + error};
        }
    }

    async getPost(id: string) {
        try {
            const post = await this.prisma.post.findFirst({where: {id: id}});
            return post;
        } catch (error) {
            return {"error": "error in getting post \n" + error};
        }
    }

    async getUsersPost(id: string) {
        try {
            const post = await this.prisma.post.findMany({where: {userId: id}});
            return post;
        } catch (error) {
            return {"error": "error in getting user's post \n" + error};
        }
    }

    async getTimelinePosts(id: string) {
        const {followings} = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                followings: true
            }
        });

        const posts = await this.prisma.post.findMany({});
        let timeline = [];
        for (const post of posts) {
            if (followings.includes(post.userId)) {
                timeline.push(post);
            }
        }
        return timeline;
    }

    async likePost(id: string, postId: string){
        const {likes} = await this.prisma.post.findFirst({where: {id: postId}});
        if (likes.includes(id)) {
            try {
                const post = await this.prisma.post.update({
                    where: {
                        id: postId
                    },
                    data: {
                        likes: likes.filter((like: string) => like !== id)
                    }
                })
                return post.likes;
            } catch (error) {
                return {"error": "error in liking back post \n" + error};
            }
        }
        try {
            const post = await this.prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likes: {
                        push : id
                    }
                }
            })
            return post.likes;
        } catch (error) {
            return {"error": "error in liking post \n" + error};
        }
    }

    async ratePost(userId: string, postId: string, rate: number) {
        const newRate: any = {
            userId: userId,
            rate: rate
        }

        const {rating} = await this.prisma.post.findUnique({where: {id: postId}});

        rating.forEach(async (rate: any)  => {
            for (let key in rate) {
                console.log(key);
                if (key === "userId" && rate[key] === userId) {
                    await this.prisma.post.update({
                        where: {
                            id: postId,
                        },
                        data: {
                            rating: rating.filter((rate: any) => rate.userId !== userId)
                        }
                    })    
                }
            }
          })

        try {
            const post = await this.prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    rating: {
                        push: newRate
                    }
                }
            })
            return post.rating;
        } catch (error) {
            return {"error": "error in rating post \n" + error};
        }
    }

    async getPostScore(postId: string) {
        try {
            let score: number = 0;
            const post = await this.prisma.post.findFirst({where: {id: postId}});
            post.rating.forEach(async (rate: any)  => {
                for (let key in rate) {
                    if (key === "rate") {
                        score += rate[key];
                    }
                }
              })
              return score/post.rating.length;
        } catch (error) {
            return {"error": "error in scoring post \n" + error};
        }
    }

}
