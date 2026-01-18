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
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdateCommentsLockedDto } from './dto/update-comments-locked.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ======= LIST POSTS =======
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: PostQueryDto, @Req() req: any): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { data, count } = await this.postsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.authorId,
      sort: query.sort,
      dateRange: query.dateRange,
      currentUserId: req.user?.id,
      communityId: query.communityId,
      savedByUserId:query.savedByUserId ,
      status: query.status,
    });

    const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length);
    return new PaginatedResponseDto(data.map(PostResponseDto.fromEntity), paginationMeta);
  }

  // ======= CREATE POST =======
  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePostDto, @GetUser() user: User): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.create({
      title: dto.title,
      content: dto.content,
      authorId: user.id,
      communityId: dto.communityId,
    });
    return new ResponseDto(PostResponseDto.fromEntity(post));
  }

  // ======= UPDATE POST =======
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto ,
     @GetUser() user :User
  ): Promise<ResponseDto<PostResponseDto>> {
    const updatedPost = await this.postsService.update(user.id,{ id, title: dto.title, content: dto.content });
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }

  // ======= DELETE POST =======
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number,
  @GetUser() user :User): Promise<ResponseDto<boolean>> {
    const success = await this.postsService.remove(id,user.id);
    return new ResponseDto(success);
  }

  // ======= UPDATE STATUS =======
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updatePostStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostStatusDto,
    @GetUser() user: User
  ): Promise<ResponseDto<PostResponseDto>> {
    const updatedPost = await this.postsService.updatePostStatus(id, dto.status, user.id);
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }

  // ======= UPDATE COMMENTS LOCKED =======
  @Patch(':id/comments-locked')
  @UseGuards(JwtAuthGuard)
  async updateCommentsLockedStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentsLockedDto,
        @GetUser() user: User

  ): Promise<ResponseDto<PostResponseDto>> {
    const updatedPost = await this.postsService.updateCommentsLockedStatus(user.id,id, dto.commentsLocked);
    return new ResponseDto(PostResponseDto.fromEntity(updatedPost));
  }

  // ======= GET SINGLE POST =======
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user?: User): Promise<ResponseDto<PostResponseDto>> {
    const post = await this.postsService.findOne(id, user?.id);
    if (!post) throw new NotFoundException('Post not found');
    this.postsService.incrementViews(id);
    return new ResponseDto(PostResponseDto.fromEntity(post));
  }
}
