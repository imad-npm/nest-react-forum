// src/reactions/reactions.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { ReactionType } from './reactions.types';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepo: Repository<PostReaction>,

    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,

    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) { }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create({
    type,
    userId,
    postId,
    commentId,
  }: {
    type: ReactionType;
    userId: number;
    postId?: number;
    commentId?: number;
  }) {
    if (!Object.values(ReactionType).includes(type)) {
      throw new BadRequestException('Invalid reaction type');
    }

    if (!!postId === !!commentId) {
      throw new BadRequestException(
        'Reaction must target either a post or a comment (not both)',
      );
    }


    if (postId) {
      const post = await this.postsService.findOne(postId);
      if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

      const existing = await this.postReactionRepo.findOne({
        where: { userId, postId },
      });

      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this post',
        );
      }

      const newReaction = await this.postReactionRepo.save(
        this.postReactionRepo.create({ type, userId, postId }),
      );
      if (newReaction.type === ReactionType.LIKE) {
        await this.postsService.incrementLikesCount(postId);
      } else {
        await this.postsService.incrementDislikesCount(postId);
      }
      return newReaction;
    }
    else if (commentId) {
      const comment = await this.commentsService.findOne(commentId);
      if (!comment) throw new NotFoundException(`Comment with ID ${commentId} not found`);

      const existing = await this.commentReactionRepo.findOne({
        where: { userId, commentId },
      });

      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this comment',
        );
      }

      const newReaction = await this.commentReactionRepo.save(
        this.commentReactionRepo.create({ type, userId, commentId }),
      );
      if (newReaction.type === ReactionType.LIKE) {
        await this.commentsService.incrementLikesCount(commentId);
      } else {
        await this.commentsService.incrementDislikesCount(commentId);
      }
      return newReaction;
    }
    throw new BadRequestException(
      'Reaction must target either a post or a comment',
    );

  }
  async findByPost({
    postId,
    page = 1,
    limit = 10,
  }: {
    postId: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: PostReaction[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.postReactionRepo.findAndCount({
      where: { postId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
      skip,
      take: limit,
    });

    return { data, count };
  }

  async findByComment({
    commentId,
    page = 1,
    limit = 10,
  }: {
    commentId: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: CommentReaction[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.commentReactionRepo.findAndCount({
      where: { commentId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
      skip,
      take: limit,
    });

    return { data, count };
  }

  async getUserReactionOnPost(
    userId: number,
    postId: number,
  ) {
    return this.postReactionRepo.findOne({ where: { userId, postId } });
  }

  async findPostReactionById(id: number): Promise<PostReaction> {
    const reaction = await this.postReactionRepo.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }
    return reaction;
  }

  async findCommentReactionById(id: number): Promise<CommentReaction> {
    const reaction = await this.commentReactionRepo.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }
    return reaction;
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  async deletePostReaction(id: number) {
    const reaction = await this.postReactionRepo.findOneBy({ id });
    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }

    const result = await this.postReactionRepo.delete(id);
    if (result.affected) {
      const post = await this.postsService.findOne(reaction.postId);
      if (!post) throw new NotFoundException(`Post with ID               
     ${reaction.postId} not found`);

      if (reaction.type === ReactionType.LIKE) {
        await this.postsService.decrementLikesCount(reaction.postId);
      } else {
        await this.postsService.decrementDislikesCount(reaction.postId);
      }
    }
  }

  async deleteCommentReaction(id: number) {
    const reaction = await this.commentReactionRepo.findOneBy({ id });
    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }

    const result = await this.commentReactionRepo.delete(id);
    if (result.affected) {
       const comment = await this.commentsService.findOne(reaction.commentId);
      if (!comment) throw new NotFoundException(`Comment with ID               
     ${reaction.commentId} not found`);
     
      if (reaction.type === ReactionType.LIKE) {
        await this.commentsService.decrementLikesCount(reaction.commentId);
      } else {
        await this.commentsService.decrementDislikesCount(reaction.commentId);
      }
    }
  }
}
