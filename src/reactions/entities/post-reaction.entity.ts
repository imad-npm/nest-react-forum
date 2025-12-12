import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { ReactionType } from '../../reactions/reactions.types'; // Assuming ReactionType is still needed and will be moved or re-defined

@Entity('post_reactions')
@Index(['postId', 'userId'], { unique: true }) // Ensure a user can only react once to a post
export class PostReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @ManyToOne(() => Post, (post) => post.reactions, { onDelete: 'CASCADE' })
  post: Post;

  @Column()
  postId: number;

  @ManyToOne(() => User, (user) => user.postReactions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
