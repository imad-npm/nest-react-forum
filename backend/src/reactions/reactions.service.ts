import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { Reactable, ReactionType } from './reactions.types';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { use } from 'passport';
import { ReactionCreatedEvent } from './events/reaction-created.event';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create({
    type,
    userId,
    reactableType,
    reactableId,
  }: {
    type: ReactionType;
    userId: number;
    reactableType: Reactable;
    reactableId: number;
  }) {
    if (!Object.values(ReactionType).includes(type)) {
      throw new BadRequestException('Invalid reaction type');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetEntity = reactableType === 'post' ? Post : Comment;
      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: reactableId } });
      if (!targetObj) throw new NotFoundException(`${reactableType} not found`);

      const existing = await queryRunner.manager.findOne(Reaction, {
        where: { userId, reactableId, reactableType },
      });

      if (existing) {
        throw new ForbiddenException(
          'You already reacted to this content',
        );
      }

      const newReaction = queryRunner.manager.create(Reaction, { type, userId, reactableId, reactableType });
      
      await queryRunner.manager.save(newReaction);

      if (newReaction.type === ReactionType.LIKE) {
        await queryRunner.manager.increment(targetEntity, { id: reactableId }, 'likesCount', 1);
      } else {
        await queryRunner.manager.increment(targetEntity, { id: reactableId }, 'dislikesCount', 1);
      }
      await queryRunner.commitTransaction();
      
      this.eventEmitter.emit('reaction.created', new ReactionCreatedEvent(newReaction));

      return newReaction;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({
    reactableType,
    reactableId,
    page = 1,
    limit = 10,
  }: {
    reactableType: Reactable;
    reactableId?: number;
    page?: number;
    limit?: number;

  }): Promise<{ data: Reaction[]; count: number }> {
    const skip = (page - 1) * limit;

    const [data, count] = await this.reactionRepo.findAndCount({
      where: {
        reactableId,
        reactableType,
      },
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



  async findOne(id: number): Promise<Reaction> {
    const reaction = await this.reactionRepo.findOne({ where: { id } });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }
    return reaction;
  }


  async updateReaction({
    id,
    type,
  }: {
    id: number;
    type: ReactionType;
  }, userId: number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reaction = await queryRunner.manager.findOne(Reaction, { where: { id } });
      if (!reaction) throw new NotFoundException('Reaction not found');

      if (reaction.userId !== userId) {
        throw new ForbiddenException('You cannot modify this reaction');
      }

      const targetEntity = reaction.reactableType === 'post' ? Post : Comment;
      const targetId = reaction.reactableId;

      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: targetId } });
      if (!targetObj) throw new NotFoundException(`${reaction.reactableType} not found`);

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


  async deleteReaction(id: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reaction = await queryRunner.manager.findOne(Reaction, { where: { id } });
      if (!reaction) throw new NotFoundException('Reaction not found');

      if (reaction.userId !== userId) {
        throw new ForbiddenException('You cannot modify this reaction');
      }
      
      const targetEntity = reaction.reactableType === 'post' ? Post : Comment;
      const targetId = reaction.reactableId;

      // Check target exists
      const targetObj = await queryRunner.manager.findOne(targetEntity, { where: { id: targetId } });
      if (!targetObj) throw new NotFoundException(`${reaction.reactableType} not found`);


      const result = await queryRunner.manager.delete(Reaction, id);
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

