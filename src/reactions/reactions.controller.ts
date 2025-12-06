import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckAbility } from 'src/casl/check-abilities.decorator';
import { Actions } from 'src/casl/casl.types';
import { Reaction } from './entities/reaction.entity';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  // -----------------------------
  // Reactions for Posts
  // -----------------------------

  @Post('posts/:postId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  createPostReaction(
    @Param('postId') postId: number,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User
  ) {

    return this.reactionsService.create({ dto, user, postId });
  }

  @Get('posts/:postId/reactions')
  getPostReactions(@Param('postId') postId: number) {
    return this.reactionsService.findByPost(postId);
  }

  // -----------------------------
  // Reactions for Comments
  // -----------------------------

  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  createCommentReaction(
    @Param('commentId') commentId: number,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User
  ) {

    return this.reactionsService.create({ dto, user, commentId });
  }

  @Get('comments/:commentId/reactions')
  getCommentReactions(@Param('commentId') commentId: number) {
    return this.reactionsService.findByComment(commentId);
  }


  @Delete('reactions/:reactionId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Delete, Reaction)

  deleteReaction(@Param('reactionId') reactionId: number) {

    return this.reactionsService.delete(reactionId);
  }
}
