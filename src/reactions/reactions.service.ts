// src/reactions/reactions.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { User } from '../users/entities/user.entity';
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

  /**
   * Create a new reaction (like/dislike) on post or comment
   * One reaction per user per target allowed
   */
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
  }): Promise<PostReaction | CommentReaction> {

    if (!Object.values(ReactionType).includes(type)) {
      throw new BadRequestException('Invalid reaction type');
    }
        const existing = await this.commentReactionRepo.findOne({
      where: {
        userId,
        commentId,
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'You already reacted to this content. Remove your existing reaction first.',
      );
    }

    if (postId) {
      // before creating reaction
      const post = await this.postsService.findOne(postId);
      if (!post) throw new NotFoundException('Post not found');

      return this.createPostReaction(type, userId, postId);
    } else if (commentId) {
      return this.createCommentReaction(type, userId, commentId);
    } else {
      throw new NotFoundException('Reaction must target a post or a comment.');
    }
  }

  private async createPostReaction(
    type: ReactionType,
    userId: number,
    postId: number,
  ): Promise<PostReaction> {
   
    const reaction = this.postReactionRepo.create({
      type,
      userId,
      postId,
    });

    return this.postReactionRepo.save(reaction);
  }

  private async createCommentReaction(
    type: ReactionType,
    userId: number,
    commentId: number,
  ): Promise<CommentReaction> {

    

    const reaction = this.commentReactionRepo.create({
      type,
      userId,
      commentId,
    });

    return this.commentReactionRepo.save(reaction);
  }

  findByPost(postId: number) {
    return this.postReactionRepo.find({
      where: { postId: postId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
    });
  }

  findByComment(commentId: number) {
    return this.commentReactionRepo.find({
      where: { commentId: commentId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, name: true },
      },
    });
  }

  async deletePostReaction(id: number): Promise<void> {
    await this.postReactionRepo.delete(id);
  }

  async deleteCommentReaction(id: number): Promise<void> {
    await this.commentReactionRepo.delete(id);
  }

  async getUserReactionOnPost(
    userId: number,
    postId: number,
  ): Promise<PostReaction | null> {
    return this.postReactionRepo.findOne({
      where: {
        userId,
        postId,
      },
    });
  }

  async findPostReactionById(id: number): Promise<PostReaction> {
    const reaction = await this.postReactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }
    return reaction;
  }

  async findCommentReactionById(id: number): Promise<CommentReaction> {
    const reaction = await this.commentReactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!reaction) {
      throw new NotFoundException('Comment reaction not found');
    }
    return reaction;
  }
}
