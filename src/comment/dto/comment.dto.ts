import { IsNotEmpty, IsString } from "class-validator"

export class CommentDto {

    @IsNotEmpty()
    @IsString()
    postId: string

    @IsNotEmpty()
    @IsString()
    userId: string
    
    @IsNotEmpty()
    @IsString()
    text: string
}