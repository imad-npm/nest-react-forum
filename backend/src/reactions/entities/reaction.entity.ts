
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReactionType } from '../reactions.types';
import type { Reactable } from '../reactions.types';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
