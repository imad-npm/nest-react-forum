import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/casl.types';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { PostPipe } from 'src/posts/pipes/post.pipe';
import { CommentPipe } from 'src/comments/pipes/comment.pipe';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Comment as CommentEntity } from '../comments/entities/comment.entity';
import { CaslService } from 'src/casl/casl.service';
import { ReactionResponseDto } from './dto/reaction-response.dto';
import { PostReactionPipe } from './pipes/post-reaction.pipe';
import { CommentReactionPipe } from './pipes/comment-reaction.pipe';

@Controller()
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly caslService: CaslService,
  ) {}

  @Post('posts/:postId/reactions')
  @UseGuards(JwtAuthGuard)
  async createPostReaction(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ): Promise<ReactionResponseDto> {
    this.caslService.enforce(user, Action.Create, PostReaction);
    const reaction = await this.reactionsService.create(
      dto.type,
      user,
      post.id,
      undefined,
    );
    return ReactionResponseDto.fromEntity(reaction);
  }

  @Get('posts/:postId/reactions')
  async getPostReactions(
    @Param('postId', PostPipe) post: PostEntity,
  ): Promise<ReactionResponseDto[]> {
    const reactions = await this.reactionsService.findByPost(post.id);
    return reactions.map(ReactionResponseDto.fromEntity);
  }

  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard)
  async createCommentReaction(
    @Param('commentId', CommentPipe) comment: CommentEntity,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ): Promise<ReactionResponseDto> {
    this.caslService.enforce(user, Action.Create, CommentReaction);
    const reaction = await this.reactionsService.create(
      dto.type,
      user,
      undefined,
      comment.id,
    );
    return ReactionResponseDto.fromEntity(reaction);
  }

  @Get('comments/:commentId/reactions')
  async getCommentReactions(
    @Param('commentId', CommentPipe) comment: CommentEntity,
  ): Promise<ReactionResponseDto[]> {
    const reactions = await this.reactionsService.findByComment(comment.id);
    return reactions.map(ReactionResponseDto.fromEntity);
  }

  @Delete('posts/:postId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async deletePostReaction(
    @Param('reactionId', PostReactionPipe) reaction: PostReaction,
    @GetUser() user: User,
  ) {
    this.caslService.enforce(user, Action.Delete, reaction);
    return await this.reactionsService.deletePostReaction(reaction.id);
  }

  @Delete('comments/:commentId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async deleteCommentReaction(
    @Param('reactionId', CommentReactionPipe) reaction: CommentReaction,
    @GetUser() user: User,
  ) {
    this.caslService.enforce(user, Action.Delete, reaction);
    return await this.reactionsService.deleteCommentReaction(reaction.id);
  }
}
