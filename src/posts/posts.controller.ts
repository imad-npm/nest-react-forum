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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly caslService: CaslService,
  ) {}

  @Get()
  async findAll(@Query() query: PostQueryDto) {
    const { data, count } = await this.postsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      authorId: query.authorId,
      sort: query.sort,
      startDate: query.startDate,
      endDate: query.endDate,
    });

    return {
      data: data.map(PostResponseDto.fromEntity),
      count,
      page: query.page,
      pages: Math.ceil(count / query.limit),
    };
  }

  @Get(':id')
  findOne(@Param('id', PostPipe) post: PostEntity): PostResponseDto {
    this.postsService.update({ id:post.id, views: post.views + 1 });
    return PostResponseDto.fromEntity(post);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponseDto> {
    this.caslService.enforce(user, Action.Create, PostEntity);
    const post = await this.postsService.create({
      title: dto.title,
      content: dto.content,
      author: user,
      communityId: dto.communityId,
    });
    return PostResponseDto.fromEntity(post);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponseDto> {
    this.caslService.enforce(user, Action.Update, post);
    const updatedPost = await this.postsService.update({
      id:post.id,
      title: dto.title,
      content: dto.content,
    });
    return PostResponseDto.fromEntity(updatedPost);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', PostPipe) post: PostEntity, @GetUser() user: User) {
    this.caslService.enforce(user, Action.Delete, post);
    return await this.postsService.remove(post.id);
  }
}
