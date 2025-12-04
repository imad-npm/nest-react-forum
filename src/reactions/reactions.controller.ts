import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  // -----------------------------
  // Reactions for Posts
  // -----------------------------

  @Post('posts/:postId/reactions')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  deleteReaction(@Param('reactionId') reactionId: number) {

    return this.reactionsService.delete(reactionId);
  }
}
