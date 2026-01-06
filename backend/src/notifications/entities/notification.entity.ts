import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  recipient: User;

  @Column()
  type: string;

  @Column({ default: false })
  read: boolean;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  postId?: number;

  @Column({ nullable: true })
  commentId?: number;

  @ManyToOne(() => User)
  actor: User;
}
