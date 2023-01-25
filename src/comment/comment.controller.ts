import { CommentService } from './comment.service';
import { Param } from '@nestjs/common/decorators';
import { GetUser } from './../auth/decorator/get_user.decorator';
import {
  Controller,
  Post,
  Delete,
  Put,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JWTGuard, PostGuard } from 'src/auth/guards';

@UseGuards(JWTGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/:id')
  commentPost(
    @GetUser('id', new ParseUUIDPipe()) id: string,
    @Param('id', new ParseUUIDPipe()) postId: string,
    @Body() body: string,
  ) {
    return this.commentService.commentPost(id, postId, body['text']);
  }

  @Delete('/:id')
  @UseGuards(PostGuard)
  deleteComment(@Param('id', new ParseUUIDPipe()) commentId: string) {
    return this.commentService.deleteComment(commentId);
  }

  @Put('/:id')
  @UseGuards(PostGuard)
  editComment(
    @GetUser('id', new ParseUUIDPipe()) id: string,
    @Param('id', new ParseUUIDPipe()) commentId: string,
    @Body() body: string,
  ) {
    return this.commentService.editComment(id, body['text'], commentId);
  }
}
