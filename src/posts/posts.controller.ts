// posts/posts.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostType } from './entities/post.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckAbility } from 'src/casl/check-abilities.decorator';
import { Actions } from 'src/casl/casl.types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  findAll(): Promise<PostType[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostType | null> {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)

  create(@Body() createPostDto: CreatePostDto,
    @GetUser() user: User
  ): Promise<PostType> {
    return this.postsService.create(createPostDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
@CheckAbility(Actions.Update, PostType)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostType | null> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
@CheckAbility(Actions.Update, PostType)
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.postsService.remove(id).then(deleted => ({ deleted }));
  }
}
