import { JWTGuard, PostGuard } from 'src/auth/guards';
import { PostService } from './post.service';
import { PostDto, UpdatePostDto } from './dto/post.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Delete,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { Param } from '@nestjs/common/decorators';

@UseGuards(JWTGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  createPost(
    @Body() postData: PostDto,
    @GetUser('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.postService.createPost(id, postData);
  }

  @Put('update/:id')
  @UseGuards(PostGuard)
  updatePost(
    @Body() postData: UpdatePostDto,
    @Param('id', new ParseUUIDPipe()) postId: string,
  ) {
    return this.postService.updatePost(postData, postId);
  }

  @Delete('delete/:id')
  @UseGuards(PostGuard)
  deletePost(@Param('id', new ParseUUIDPipe()) postId: string) {
    return this.postService.deletePost(postId);
  }

  @Get('get/:id')
  getPost(@Param('id', new ParseUUIDPipe()) postId: string) {
    return this.postService.getPost(postId);
  }

  @Get('userposts/:id')
  getUsersPost(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postService.getUsersPost(id);
  }

  @Get('timeline')
  getTimelinePosts(@GetUser('id', new ParseUUIDPipe()) id: string) {
    return this.postService.getTimelinePosts(id);
  }

  @Put('like/:id')
  likePost(
    @GetUser('id', new ParseUUIDPipe()) id: string,
    @Param('id', new ParseUUIDPipe()) postId: string,
  ) {
    return this.postService.likeStuff(id, postId);
  }

  @Put('rate/:id')
  ratePost(
    @GetUser('id', new ParseUUIDPipe()) id: string,
    @Param('id', new ParseUUIDPipe()) postId: string,
    @Body('rate') rate: number,
  ) {
    return this.postService.ratePost(id, postId, rate);
  }

  @Get('score/:id')
  getPostScore(@Param('id', new ParseUUIDPipe()) postId: string) {
    return this.postService.getPostScore(postId);
  }
}
