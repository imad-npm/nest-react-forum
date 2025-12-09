import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl.types';
import { Reaction } from './entities/reaction.entity';
import { ReactionPipe } from 'src/common/pipes/reaction.pipe';
import { PostPipe } from 'src/common/pipes/post.pipe';
import { CommentPipe } from 'src/common/pipes/comment.pipe';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Comment as CommentEntity } from '../comments/entities/comment.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Controller()
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post('posts/:postId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Reaction))
  async createPostReaction(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ) {
    return this.reactionsService.create(dto.type, user, post.id);
  }

  @Get('posts/:postId/reactions')
  getPostReactions(@Param('postId', PostPipe) post: PostEntity) {
    return this.reactionsService.findByPost(post.id);
  }

  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Reaction))
  async createCommentReaction(
    @Param('commentId', CommentPipe) comment: CommentEntity,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ) {
    return this.reactionsService.create(dto.type, user, undefined, comment.id);
  }

  @Get('comments/:commentId/reactions')
  getCommentReactions(@Param('commentId', CommentPipe) comment: CommentEntity) {
    return this.reactionsService.findByComment(comment.id);
  }

  @Delete('reactions/:reactionId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Reaction))
  async deleteReaction(
    @Param('reactionId', ReactionPipe) reaction: Reaction,
    @GetUser() user: User,
  ) {
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Delete, reaction)) {
      throw new ForbiddenException('You are not allowed to delete this reaction');
    }

    return this.reactionsService.delete(reaction);
  }
}
