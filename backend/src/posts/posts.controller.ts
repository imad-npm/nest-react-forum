import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostApprovalDto } from './dto/update-post-approval.dto'; // Import the new DTO
import { UpdateCommentsLockedDto } from './dto/update-comments-locked.dto';
import { Post as PostEntity } from './entities/post.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostPipe } from 'src/posts/pipes/post.pipe';
import { Action } from 'src/casl/casl.types';
import { CaslService } from 'src/casl/casl.service';
import { PostResponseDto } from './dto/post-response.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import type { Request } from 'express';
import { CommunityType } from 'src/communities/types';
import { CommunityMembershipRole } from 'src/community-memberships/types';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly caslService: CaslService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: PostQueryDto,
    @Req() req: any
  ): Promise<PaginatedResponseDto<PostResponseDto>> {

    const { data, count } = await this.postsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.authorId,
      sort: query.sort,
      startDate: query.startDate,
      endDate: query.endDate,
      currentUserId: req.user?.id ?? undefined,
      communityId: query.communityId,
    });

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(data.map(PostResponseDto.fromEntity), paginationMeta);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @GetUser() user?: User, // Get user if authenticated
  ): Promise<ResponseDto<PostResponseDto>> {
    const postId = +id;
    const post = await this.postsService.findOne(postId, user?.id); // Pass currentUserId

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    this.postsService.incrementViews(postId);
    return new ResponseDto(PostResponseDto.fromEntity(post));
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<PostResponseDto>> {
    this.caslService.enforce(user, Action.Create, PostEntity);
    const post = await this.postsService.create({
      title: dto.title,
      content: dto.content,
      authorId: user.id,
      communityId: dto.communityId,
    });
    return new ResponseDto(PostResponseDto.fromEntity(post));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<PostResponseDto>> {
    this.caslService.enforce(user, Action.Update, post);
    const updatedPost = await this.postsService.update({
      id: post.id,
      title: dto.title,
      content: dto.content,
    });
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', PostPipe) post: PostEntity, @GetUser() user: User): Promise<ResponseDto<boolean>> {
    this.caslService.enforce(user, Action.Delete, post);
    const success = await this.postsService.remove(post.id);
    return new ResponseDto(success);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  // TODO: Add admin role guard here
  async updatePostApprovalStatus(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdatePostApprovalDto, // Use the new DTO
    @GetUser() user: User, // For potential admin check
  ): Promise<ResponseDto<PostResponseDto>> {
    const updatedPost = await this.postsService.updatePostApprovalStatus(post.id, dto.isApproved,user.id);
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }

  @Patch(':id/comments-locked')
  @UseGuards(JwtAuthGuard)
  // TODO: Add proper authorization using caslService.enforce
  async updateCommentsLockedStatus(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdateCommentsLockedDto,
    @GetUser() user: User, // For authorization check
  ): Promise<ResponseDto<PostResponseDto>> {
    this.caslService.enforce(user, Action.Update, post); // Enforce update on commentsLocked field
    const updatedPost = await this.postsService.updateCommentsLockedStatus(post.id, dto.commentsLocked);
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }


  }
