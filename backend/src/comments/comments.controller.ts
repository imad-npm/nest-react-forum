import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  NotFoundException,
  ParseIntPipe, // Added
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard'; // Added
import { Action } from 'src/casl/casl.types';
import { Comment } from './entities/comment.entity';
// Removed CommentPipe
import { Post as PostEntity } from 'src/posts/entities/post.entity';
import { PostPipe } from 'src/posts/pipes/post.pipe';
import { CaslService } from 'src/casl/casl.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CommentPipe } from './pipes/comment.pipe';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly caslService: CaslService,
  ) { }

  @Get('comments')
  @UseGuards(OptionalJwtAuthGuard) // Add guard to get user
  async findAll(@Query() query: CommentQueryDto, @GetUser() user: User): Promise<PaginatedResponseDto<CommentResponseDto>> {
    const { data, count } = await this.commentsService.findAll(
    { page: query.page,
      limit :query.limit,
      search :query.search,
      authorId :query.authorId,
      parentId:query.parentId ,
      postId :query.postId, // Ensure postId is passed to service
      currentUserId: user?.id, // Pass currentUserId
    }
    );

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(data.map(CommentResponseDto.fromEntity), paginationMeta);
  }

  @HttpPost('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createForPost(
    @Param('postId', PostPipe) post: PostEntity,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommentResponseDto>> {
    this.caslService.enforce(user, Action.Create, Comment);
    const comment = await this.commentsService.createComment(
      post.id,
      dto.content,
      user.id,
      dto.parentId,
    );
    return new ResponseDto(CommentResponseDto.fromEntity(comment));
  }

  @Get('comments/:id')
  @UseGuards(OptionalJwtAuthGuard) // Add guard to get user
  async findOne(
    @Param('id') id: number, // Get id directly
    @GetUser() user: User, // Get current user
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.findOne(id, user?.id); // Call service method
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return new ResponseDto(CommentResponseDto.fromEntity(comment));
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', CommentPipe) comment: Comment,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommentResponseDto>> {
    this.caslService.enforce(user, Action.Update, comment);
    const updatedComment = await this.commentsService.update(
      {
        id: comment.id,
        content: dto.content,
      }
    );
    return new ResponseDto(CommentResponseDto.fromEntity(updatedComment));
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', CommentPipe) comment: Comment,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    this.caslService.enforce(user, Action.Delete, comment);
    const success = await this.commentsService.remove(comment.id);
    return new ResponseDto(success);
  }
}

