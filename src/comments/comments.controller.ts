import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl.types';
import { Comment } from './entities/comment.entity';
import { CommentPipe } from 'src/common/pipes/comment.pipe';
import { Post as PostEntity } from 'src/posts/entities/post.entity';
import { PostPipe } from 'src/common/pipes/post.pipe';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CommentResponseDto } from './dto/comment-response.dto';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get('posts/:postId/comments')
  async findByPost(
    @Param('postId', PostPipe) post: PostEntity,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findByPost(post.id);
    return comments.map(CommentResponseDto.fromEntity);
  }

  @HttpPost('posts/:postId/comments')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Comment))
  async createForPost(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
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
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Comment))
  async update(
    @Param('id', CommentPipe) comment: Comment,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentResponseDto> {
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Update, comment)) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }
    const updatedComment = await this.commentsService.update(
      comment,
      dto.content,
    );
    return CommentResponseDto.fromEntity(updatedComment);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Comment))
  async remove(
    @Param('id', CommentPipe) comment: Comment,
    @GetUser() user: User,
  ) {
    const ability = this.caslAbilityFactory.createForUser(user);
    if (!ability.can(Action.Delete, comment)) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }
    return await this.commentsService.remove(comment);
  }
}
