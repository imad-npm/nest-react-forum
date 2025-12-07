import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckAbility } from 'src/casl/check-abilities.decorator';
import { Actions } from 'src/casl/casl.types';
import { PostPipe } from 'src/common/pipes/post.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', PostPipe) post: PostEntity) {
    return post;
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Create, PostEntity)
  create(
    @Body() dto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Update, PostEntity)
  update(
    @Param('id', PostPipe) post: PostEntity,
    @Body() dto: UpdatePostDto,
    @Req() req,
  ) {
   req.ability.throwUnlessCan(Actions.Update, post);
  
   
   return this.postsService.update(post, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Delete, PostEntity)
  remove(
    @Param('id', PostPipe) post: PostEntity,
    @Req() req,
  ) {
    req.ability.throwUnlessCan(Actions.Delete, post);
    return this.postsService.remove(post);
  }
}
