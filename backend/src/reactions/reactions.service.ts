import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';
import { ReactionTarget, ReactionType } from './reactions.types';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostReactionCreatedEvent } from './events/post-reaction-created.event';
import { CommentReactionCreatedEvent } from './events/comment-reaction-created.event';
import { use } from 'passport';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(PostReaction)
    private readonly postReactionRepo: Repository<PostReaction>,
    @InjectRepository(CommentReaction)
    private readonly commentReactionRepo: Repository<CommentReaction>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create({
    type,
    userId,
    target,
    targetId,
  }: {
    type: ReactionType;
    userId: number;
    target: ReactionTarget;
    targetId: number;
  }) {
    if (!Object.values(ReactionType).includes(type)) {
      throw new BadRequestException('Invalid reaction type');
    }


    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const targetEntity = target == ReactionTarget.Post ? Post : Comment;
      const reactionEntity = target == ReactionTarget.Post ? PostReaction : CommentReaction;
      const targetField = target == ReactionTarget.Post ? 'postId' : 'commentId';
      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: targetId } });
      if (!targetObj) throw new NotFoundException(`${target} not found`);

      const existing = await queryRunner.manager.findOne(reactionEntity, {
        where: { userId, [targetField]: targetId },
      });


      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this post',
        );
      }


      const newReaction: PostReaction | CommentReaction = queryRunner.manager.create(reactionEntity, { type, userId, [targetField]: targetId });
      
      await queryRunner.manager.save(newReaction);
      console.log(newReaction,userId);

      if (newReaction.type === ReactionType.LIKE) {
        await queryRunner.manager.increment(targetEntity, { id: targetId }, 'likesCount', 1);
      } else {
        await queryRunner.manager.increment(targetEntity, { id: targetId }, 'dislikesCount', 1);
      }
      await queryRunner.commitTransaction();
      if (newReaction instanceof PostReaction)
        this.eventEmitter.emit('post.reaction.created', new PostReactionCreatedEvent(newReaction));
       if (newReaction instanceof CommentReaction)
        this.eventEmitter.emit('comment.reaction.created', new CommentReactionCreatedEvent(newReaction));

      return newReaction;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({
    target,
    targetId,
    page = 1,
    limit = 10,
  }: {
    target: ReactionTarget;
    targetId?: number;
    page?: number;
    limit?: number;

  }): Promise<{ data: PostReaction[] | CommentReaction[]; count: number }> {
    const skip = (page - 1) * limit;
    const reactionRepo = target == ReactionTarget.Post ? this.postReactionRepo : this.commentReactionRepo

    const [data, count] = await reactionRepo.findAndCount({
      where:
        target === ReactionTarget.Post
          ? { postId: targetId }
          : { commentId: targetId },
      relations: ['user'],
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { id: true, username: true },
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

  async findOne(id: number, target: ReactionTarget): Promise<PostReaction | CommentReaction> {
    const reaction = target == ReactionTarget.Post ?
      await this.postReactionRepo.findOne({ where: { id } })
      : await this.commentReactionRepo.findOne({ where: { id } });

    if (!reaction) {
      throw new NotFoundException('Post reaction not found');
    }
    return reaction;
  }


  async updateReaction({
    id,
    type,
    target,
  }: {
    id: number;
    type: ReactionType;
    target: ReactionTarget;
  }, userId: number) {

    const targetEntity = target == ReactionTarget.Post ? Post : Comment;
    const reactionEntity = target == ReactionTarget.Post ? PostReaction : CommentReaction;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reaction = await queryRunner.manager.findOne(reactionEntity, { where: { id } });
      if (!reaction) throw new NotFoundException('Reaction not found');

      console.log(reactionEntity,target);
      
      if (reaction.userId !== userId) {
        throw new ForbiddenException('You cannot modify this reaction');
      }

         var targetId

      if(reaction instanceof PostReaction)
        targetId=reaction.postId
       if(reaction instanceof CommentReaction){
        targetId=reaction.commentId
 }


      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: targetId } });
      if (!targetObj) throw new NotFoundException(`${target} not found`);

      if (reaction.type === type) {
        await queryRunner.commitTransaction();
        return reaction;
      }

      const oldType = reaction.type;
      const newType = type;

      if (oldType === ReactionType.LIKE) {
        await queryRunner.manager.decrement(targetEntity, { id: targetId }, 'likesCount', 1);
      } else if (oldType === ReactionType.DISLIKE) {
        await queryRunner.manager.decrement(targetEntity, { id: targetId }, 'dislikesCount', 1);
      }

      if (newType === ReactionType.LIKE) {
        await queryRunner.manager.increment(targetEntity, { id: targetId }, 'likesCount', 1);
      } else if (newType === ReactionType.DISLIKE) {
        await queryRunner.manager.increment(targetEntity, { id: targetId }, 'dislikesCount', 1);
      }

      reaction.type = newType;
      await queryRunner.manager.save(reaction);

      await queryRunner.commitTransaction();
      return reaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async deleteReaction({
    id,
    target
  }: {
    id: number;
    target: ReactionTarget;
  }, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const targetEntity = target == ReactionTarget.Post ? Post : Comment;
    const reactionEntity = target == ReactionTarget.Post ? PostReaction : CommentReaction;

    try {
      const reaction = await queryRunner.manager.findOne(reactionEntity, { where: { id } });
      if (!reaction) throw new NotFoundException('Reaction not found');

      if (reaction.userId !== userId) {
        throw new ForbiddenException('You cannot modify this reaction');
      }
      var targetId

      if(reaction instanceof PostReaction)
        targetId=reaction.postId
       if(reaction instanceof CommentReaction){
        targetId=reaction.commentId
 }

     

      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: targetId } });
      if (!targetObj) throw new NotFoundException(`${target} not found`);


      const result = await queryRunner.manager.delete(reactionEntity, id);
      if (result.affected) {
        if (reaction.type === ReactionType.LIKE) {
          await queryRunner.manager.decrement(targetEntity, { id: targetId }, 'likesCount', 1);
        } else {
          await queryRunner.manager.decrement(targetEntity, { id: targetId }, 'dislikesCount', 1);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

