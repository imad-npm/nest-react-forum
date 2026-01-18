// backend/src/saved-posts/saved-posts.controller.ts
import { Controller, Post, Delete, Param, Req, Query, Get, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { SavedPostsService } from './saved-posts.service';
import { CreateSavedPostDto } from './dto/create-saved-post.dto';
import { SavedPostsQueryDto } from './dto/saved-posts-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // [cite: 9291]
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { SavedPostResponseDto } from './dto/saved-post-response.dto';

@Controller('saved-posts')
@UseGuards(JwtAuthGuard)
export class SavedPostsController {
    constructor(private service: SavedPostsService) { }
    
   @Get()
    async list(@GetUser() user: User,
 @Query() query: SavedPostsQueryDto) {

        const { data, count } = await this.service.findAll({
          page: query.page,
          limit: query.limit,
          userId:user.id   
        });
    
        const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length);
        return new PaginatedResponseDto(data.map(SavedPostResponseDto.fromEntity), paginationMeta);
      
    }

    @Post()
    async save(@GetUser() user: User,
   @Body() dto: CreateSavedPostDto) {
        return this.service.createSave(user.id, dto.postId);
    }

    @Delete(':postId')
    async unsave(@GetUser() user: User,
 @Param('postId', ParseIntPipe) postId: number) {
        return this.service.removeSave(user.id, postId);
    }

 
}