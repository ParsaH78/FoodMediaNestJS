import { updateUserDto } from './dto/user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

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
                }
            });

            delete user.password;
            delete user.createdAt;
            delete user.updatedAt;
    
            return user;
        } catch (error) {
            return {"error": error};
        }
    }

    async deleteUser (id: string) {
        try {
            await this.prisma.user.delete({where: {id: id}});
            return {"message": "User has been deleted"};
        } catch (error) {
            return {"error": error};
        }
    }

    async updateUserFavorites(userId: string, postId: string) {
        try {
            const {favorites} = await this.prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    favorites: true
                }
            });

            if (favorites.length > 0) {
                const user = await this.prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        favorites: {
                            set: favorites.filter((item) => item !== postId)
                        }
                    }
                })
                return user.favorites;
            }

            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    favorites: {
                        push: postId
                    }
                }
            })

            return user.favorites;
        } catch (error) {
            return {"error": error};
        }
    }

    async followUser (userId: string, targetId: string) {

        if (userId === targetId) {
            return {error: "you can't follow yourself !"};
        }

        const user = await this.prisma.user.findUnique({where: {id: userId}, select: {followings: true}});
        const target = await this.prisma.user.findUnique({where: {id: targetId}, select: {followers: true}});

        if (!target) {
            return {error: "Target does not exist"}
        }


        if (user.followings.includes(targetId)) {
            try {
                const updatedUser = await this.prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        followings: {
                            set: user.followings.filter((item) => item !== targetId)
                        }
                    }
                })

                await this.prisma.user.update({
                    where: {
                        id: targetId
                    },
                    data: {
                        followers: {
                            set: target.followers.filter((item) => item !== userId)
                        }
                    }
                })
                return updatedUser.followings;
            } catch (error) {
                return {"error": error};
            }
        } else {
            try {
                const user = await this.prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        followings: {
                            push: targetId
                        }
                    }
                })
                await this.prisma.user.update({
                    where: {
                        id: targetId
                    },
                    data: {
                        followers: {
                            push: userId
                        }
                    }
                })
                return user.followings;
            } catch (error) {
                return {"error": error};
            }
        }
    }
}
