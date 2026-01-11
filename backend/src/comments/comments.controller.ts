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
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get('comments')
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query() query: CommentQueryDto,
    @GetUser() user: User,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    const { data, count } = await this.commentsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.authorId,
      parentId: query.parentId,
      postId: query.postId,
      currentUserId: user?.id,
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(
      data.map(CommentResponseDto.fromEntity),
      paginationMeta,
    );
  }

  @HttpPost('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  async createForPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.createComment(
      postId,
      dto.content,
      user.id,
      dto.parentId,
    );
    return new ResponseDto(CommentResponseDto.fromEntity(comment));
  }

  @Get('comments/:id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<CommentResponseDto>> {
    const comment = await this.commentsService.findOne(id, user?.id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return new ResponseDto(CommentResponseDto.fromEntity(comment));
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,

  ): Promise<ResponseDto<CommentResponseDto>> {
    const updatedComment = await this.commentsService.update({
      id,
      content: dto.content,
    },user.id);
    return new ResponseDto(CommentResponseDto.fromEntity(updatedComment));
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    const success = await this.commentsService.remove(id,user.id);
    return new ResponseDto(success);
  }
}
