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

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get('posts/:postId/comments')
  findByPost(@Param('postId', PostPipe) post: PostEntity) {
    return this.commentsService.findByPost(post.id);
  }

  @HttpPost('posts/:postId/comments')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Comment))
  createForPost(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.createForPost(post, dto, user);
  }

  @Get('comments/:id')
  findOne(@Param('id', CommentPipe) comment: Comment) {
    return comment;
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Comment))
  update(
    @Param('id', CommentPipe) comment: Comment,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    // Check permission against the SPECIFIC comment instance
    const ability = this.caslAbilityFactory.createForUser(user);
    
    if (!ability.can(Action.Update, comment)) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }

    return this.commentsService.update(comment, dto);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Comment))
  remove(
    @Param('id', CommentPipe) comment: Comment,
    @GetUser() user: User,
  ) {
    // Check permission against the SPECIFIC comment instance
    const ability = this.caslAbilityFactory.createForUser(user);
    
    if (!ability.can(Action.Delete, comment)) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.commentsService.remove(comment);
  }
}
