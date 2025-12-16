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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly caslService: CaslService,
  ) {}

  @Get()
  async findAll(@Query() query: PostQueryDto): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { data, count } = await this.postsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.authorId,
      sort: query.sort,
      startDate: query.startDate,
      endDate: query.endDate,
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
  findOne(@Param('id', PostPipe) post: PostEntity): ResponseDto<PostResponseDto> {
    this.postsService.incrementViews(post.id);
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
      author: user,
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
      id:post.id,
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
}
