import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { ReactionQueryDto } from './dto/reaction-query.dto';
import { ReactionResponseDto } from './dto/reaction-response.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PostResponseDto } from 'src/posts/dto/post-response.dto';
import { ReactionTarget } from './reactions.types';
import { DeleteReactionDto } from './dto/delete-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
  ) {}

  // CREATE (post or comment)
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateReactionDto,
    @GetUser() user: User,
  ): Promise<ReactionResponseDto> {
  const reaction = await this.reactionsService.create(
     {   type :dto.type,
      userId :user.id,
      target:dto.target,
    targetId:dto.targetId
    }
    );    return ReactionResponseDto.fromEntity(reaction);
  }

  // LIST by target
  @Get()
  async findAll(
    @Query() query: ReactionQueryDto,
  ) {
    const { data, count } = await this.reactionsService.findAll({ target:query.target,
      targetId:query.targetId, 
      page: query.page,
       limit: query.limit });
       const paginationMeta = new PaginationMetaDto(query.page, query.limit, count, data.length);
        return new PaginatedResponseDto(data.map(ReactionResponseDto.fromEntity), paginationMeta);
     
   
  }

  // UPDATE
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReactionDto,
    @GetUser() user: User,
  ): Promise<ReactionResponseDto> {
    const reaction = await this.reactionsService.updateReaction({
      id,
      type:dto.type ,
      target:dto.target
    } ,user.id);
    return ReactionResponseDto.fromEntity(reaction);
  }

  // DELETE
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
      @Body() dto: DeleteReactionDto,
  ): Promise<{ success: true }> {
    await this.reactionsService.deleteReaction({id,target:dto.target}, user.id);
    return { success: true };
  }
}
