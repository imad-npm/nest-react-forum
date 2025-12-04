import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  // -----------------------------
  // Reactions for Posts
  // -----------------------------
  @Post('posts/:postId/reactions')
  createPostReaction(
    @Param('postId') postId: number,
    @Body() dto: CreateReactionDto
  ) {
    // Combine DTO with route param
// Return a mock user for testing
    const user = new User();
    user.id = 1;
    user.name = 'Mock User';
    user.email = 'mock@example.com';
      return this.reactionsService.create({ dto,user ,postId });
  }

  @Get('posts/:postId/reactions')
  getPostReactions(@Param('postId') postId: number) {
    return this.reactionsService.findByPost(postId);
  }

  // -----------------------------
  // Reactions for Comments
  // -----------------------------
  @Post('comments/:commentId/reactions')
  createCommentReaction(
    @Param('commentId') commentId: number,
    @Body() dto: CreateReactionDto
  ) {
// Return a mock user for testing
    const user = new User();
    user.id = 1;
    user.name = 'Mock User';
    user.email = 'mock@example.com';
    return this.reactionsService.create({ dto,user ,commentId });
   }

  @Get('comments/:commentId/reactions')
  getCommentReactions(@Param('commentId') commentId: number) {
    return this.reactionsService.findByComment(commentId);
  }

  @Delete('reactions/:reactionId')
  deleteReaction(@Param('reactionId') reactionId: number) {
    
    return this.reactionsService.delete( reactionId );
  }
}
