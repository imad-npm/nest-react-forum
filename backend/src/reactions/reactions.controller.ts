import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/casl.types';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Comment as CommentEntity } from '../comments/entities/comment.entity';
import { CaslService } from 'src/casl/casl.service';
import { ReactionResponseDto } from './dto/reaction-response.dto';
import { PostReactionPipe } from './pipes/post-reaction.pipe';
import { CommentReactionPipe } from './pipes/comment-reaction.pipe';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { ReactionQueryDto } from './dto/reaction-query.dto';
import { CommentPipe } from 'src/comments/pipes/comment.pipe';
import { PostPipe } from 'src/posts/pipes/post.pipe';


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
  ): Promise<ResponseDto<ReactionResponseDto>> {
    this.caslService.enforce(user, Action.Create, PostReaction);
    const reaction = await this.reactionsService.create(
     {   type :dto.type,
      userId :user.id,
      postId: post.id,}
    );
    return new ResponseDto(ReactionResponseDto.fromEntity(reaction));
  }

  @Get('posts/:postId/reactions')
  async getPostReactions(
    @Param('postId', PostPipe) post: PostEntity,
    @Query() query: ReactionQueryDto,
  ): Promise<PaginatedResponseDto<ReactionResponseDto>> {
    const { data, count } = await this.reactionsService.findByPost({ postId: post.id, page: query.page, limit: query.limit });
    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );
    return new PaginatedResponseDto(data.map(ReactionResponseDto.fromEntity), paginationMeta);
  }

  @Patch('posts/:postId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async updatePostReaction(
    @Param('reactionId', PostReactionPipe) reaction: PostReaction,
    @Body() dto: UpdateReactionDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<ReactionResponseDto>> {
    this.caslService.enforce(user, Action.Update, reaction);
    const updatedReaction = await this.reactionsService.updatePostReaction({
       id:reaction.id,
       type:dto.type});
    return new ResponseDto(ReactionResponseDto.fromEntity(updatedReaction));
  }

  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard)
  async createCommentReaction(
    @Param('commentId', CommentPipe) comment: CommentEntity,
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<ReactionResponseDto>> {
    this.caslService.enforce(user, Action.Create, CommentReaction);
    const reaction = await this.reactionsService.create(
   {   type :dto.type,
      userId :user.id,
      commentId: comment.id,}
    );
    return new ResponseDto(ReactionResponseDto.fromEntity(reaction));
  }

  @Get('comments/:commentId/reactions')
  async getCommentReactions(
    @Param('commentId', CommentPipe) comment: CommentEntity,
    @Query() query: ReactionQueryDto,
  ): Promise<PaginatedResponseDto<ReactionResponseDto>> {
    const { data, count } = await this.reactionsService.findByComment({ commentId: comment.id, page: query.page, limit: query.limit });
    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );
    return new PaginatedResponseDto(data.map(ReactionResponseDto.fromEntity), paginationMeta);
  }

  @Patch('comments/:commentId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async updateCommentReaction(
    @Param('reactionId', CommentReactionPipe) reaction: CommentReaction,
    @Body() dto: UpdateReactionDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<ReactionResponseDto>> {
    this.caslService.enforce(user, Action.Update, reaction);
    const updatedReaction = await this.reactionsService.updateCommentReaction({ id:reaction.id,
      type: dto.type});
    return new ResponseDto(ReactionResponseDto.fromEntity(updatedReaction));
  }

  @Delete('posts/:postId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async deletePostReaction(
    @Param('reactionId', PostReactionPipe) reaction: PostReaction,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    this.caslService.enforce(user, Action.Delete, reaction);
    await this.reactionsService.deletePostReaction(reaction.id);
    return new ResponseDto(true);
  }

  @Delete('comments/:commentId/reactions/:reactionId')
  @UseGuards(JwtAuthGuard)
  async deleteCommentReaction(
    @Param('reactionId', CommentReactionPipe) reaction: CommentReaction,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    this.caslService.enforce(user, Action.Delete, reaction);
    await this.reactionsService.deleteCommentReaction(reaction.id);
    return new ResponseDto(true);
  }
}
