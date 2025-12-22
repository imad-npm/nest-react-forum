import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export abstract class BaseReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reporterId: number;

  @ManyToOne(() => User, (user) => user.postReports, { onDelete: 'CASCADE' }) // This will be overridden in concrete classes
  reporter: User;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
