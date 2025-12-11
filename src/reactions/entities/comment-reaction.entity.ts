import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity'; // Corrected path
import { User } from '../../users/entities/user.entity';
import { ReactionType } from '../../reactions/reactions.types'; // Assuming ReactionType is still needed and will be moved or re-defined

@Entity('comment_reactions')
@Index(['commentId', 'userId'], { unique: true }) // Ensure a user can only react once to a comment
export class CommentReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'simple-enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @ManyToOne(() => Comment, comment => comment.reactions, { onDelete: 'CASCADE' })
  comment: Comment;

  @Column()
  commentId: number;

  @ManyToOne(() => User, user => user.commentReactions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
