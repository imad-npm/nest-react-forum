
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReactionType } from '../reactions.types';
import type { Reactable } from '../reactions.types';
import { Post } from '../../posts/entities/post.entity';

@Entity('reactions')
@Index(['reactableId', 'reactableType', 'userId'], { unique: true })
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @Column()
  reactableId: number;

  @Column()
  reactableType: Reactable;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
  
  @ManyToOne(() => Post, (post) => post.reactions, { nullable: true })
@JoinColumn({ name: 'reactableId' }) // Tells TypeORM to use this column for the join
post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
