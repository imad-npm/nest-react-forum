import { Controller, Post, Get, Body, Param, Delete,
   UseGuards, NotFoundException, Req } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckAbility } from 'src/casl/check-abilities.decorator';
import { Actions } from 'src/casl/casl.types';
import { Reaction } from './entities/reaction.entity';
import { ReactionPipe } from 'src/common/pipes/reaction.pipe';
import { PostPipe } from 'src/common/pipes/post.pipe';         // ← Add
import { CommentPipe } from 'src/common/pipes/comment.pipe';   // ← Add
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Comment as CommentEntity } from '../comments/entities/comment.entity';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  // -----------------------------
  // Reactions for Posts
  // -----------------------------
  @Post('posts/:postId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  createPostReaction(
    @Param('postId', PostPipe) post: PostEntity,           // ← Now validated + loaded
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ) {
    return this.reactionsService.create({ dto, user, postId: post.id });
  }

  @Get('posts/:postId/reactions')
  getPostReactions(@Param('postId', PostPipe) post: PostEntity) {
    return this.reactionsService.findByPost(post.id);
  }

  // -----------------------------
  // Reactions for Comments
  // -----------------------------
  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  createCommentReaction(
    @Param('commentId', CommentPipe) comment: CommentEntity, // ← Now validated + loaded
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ) {
    return this.reactionsService.create({ dto, user, commentId: comment.id });
  }

  @Get('comments/:commentId/reactions')
  getCommentReactions(@Param('commentId', CommentPipe) comment: CommentEntity) {
    return this.reactionsService.findByComment(comment.id);
  }

  // -----------------------------
  // Delete Reaction (already perfect)
  // -----------------------------
  @Delete('reactions/:reactionId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Delete, Reaction)
  deleteReaction(@Param('reactionId', ReactionPipe)
   reaction: Reaction ,
   @Req() req,
  ) {
    req.ability.throwUnlessCan(Actions.Delete, reaction);
    return this.reactionsService.delete(reaction);
  }
}