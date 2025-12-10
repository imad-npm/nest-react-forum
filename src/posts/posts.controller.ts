import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostPipe } from 'src/common/pipes/post.pipe';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { Action } from 'src/casl/casl.types';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { }

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
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, PostEntity))
  async create(
    @Body() dto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.create(dto.title, dto.content, user);
    return PostResponseDto.fromEntity(post);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, PostEntity))
  async update(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostResponseDto> {
    // 1. Generate the ability for the current user
    const ability = this.caslAbilityFactory.createForUser(user);
    // 2. Check permission against the SPECIFIC post instance
    // This triggers the rule: can(Action.Update, Post, { authorId: user.id })
    if (!ability.can(Action.Update, post)) {
      throw new ForbiddenException('You are not allowed to update this post');
    }
    const updatedPost = await this.postsService.update(post, dto.title, dto.content);
    return PostResponseDto.fromEntity(updatedPost);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, PostEntity))
  async remove(
    @Param('id', PostPipe) post: PostEntity,
    @GetUser() user: User,
  ) {
    // 1. Generate the ability for the current user
    const ability = this.caslAbilityFactory.createForUser(user);
    // 2. Check permission against the SPECIFIC post instance
    if (!ability.can(Action.Delete, post)) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
    return  await this.postsService.remove(post);
  }
}