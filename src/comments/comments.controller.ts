import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckAbility } from 'src/casl/check-abilities.decorator';
import { Actions } from 'src/casl/casl.types';
import { Comment } from './entities/comment.entity';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService:
     CommentsService,
    private readonly postsService: PostsService) {}

  @Get('posts/:postId/comments')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(+postId);
  }

  @Post('posts/:postId/comments')
    @UseGuards(JwtAuthGuard)   

 async createForPost(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() author : User
  ) {
    // 1. Fetch the full Post entity (with author if needed)
    const post = await this.postsService.findOne(+postId);

  if(!post){
    return new NotFoundException() ;
  }
    return this.commentsService.createForPost(post, createCommentDto,author);
  }

  @Get('comments/:id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }


  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Update, Comment)   
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckAbility(Actions.Delete, Comment)   
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
