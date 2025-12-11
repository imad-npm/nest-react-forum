import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/casl.types';
import { Comment } from './entities/comment.entity';
import { CommentPipe } from 'src/comments/pipes/comment.pipe';
import { Post as PostEntity } from 'src/posts/entities/post.entity';
import { PostPipe } from 'src/posts/pipes/post.pipe';
import { CaslService } from 'src/casl/casl.service';
import { CommentResponseDto } from './dto/comment-response.dto';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly caslService: CaslService,
  ) {}

  @Get('posts/:postId/comments')
  async findByPost(
    @Param('postId', PostPipe) post: PostEntity,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findByPost(post.id);
    return comments.map(CommentResponseDto.fromEntity);
  }

  @HttpPost('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createForPost(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
    this.caslService.enforce(user, Action.Create, Comment);
    const comment = await this.commentsService.createForPost(
      post,
      dto.content,
      user,
      dto.parentId,
    );
    return CommentResponseDto.fromEntity(comment);
  }

  @Get('comments/:id')
  findOne(@Param('id', CommentPipe) comment: Comment): CommentResponseDto {
    return CommentResponseDto.fromEntity(comment);
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', CommentPipe) comment: Comment,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
    this.caslService.enforce(user, Action.Update, comment);
    const updatedComment = await this.commentsService.update(
      comment,
      dto.content,
    );
    return CommentResponseDto.fromEntity(updatedComment);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', CommentPipe) comment: Comment,
    @GetUser() user: User,
  ) {
    this.caslService.enforce(user, Action.Delete, comment);
    return await this.commentsService.remove(comment);
  }
}
