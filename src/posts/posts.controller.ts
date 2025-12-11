import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly caslService: CaslService,
  ) {}

  @Get()
  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsService.findAll();
    return posts.map(PostResponseDto.fromEntity);
  }

  @Get(':id')
  findOne(@Param('id', PostPipe) post: PostEntity): PostResponseDto {
    return PostResponseDto.fromEntity(post);
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponseDto> {
    this.caslService.enforce(user, Action.Create, PostEntity);
    const post = await this.postsService.create(dto.title, dto.content, user);
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
    const updatedPost = await this.postsService.update(
      post,
      dto.title,
      dto.content,
    );
    return PostResponseDto.fromEntity(updatedPost);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', PostPipe) post: PostEntity, @GetUser() user: User) {
    this.caslService.enforce(user, Action.Delete, post);
    return await this.postsService.remove(post);
  }
}