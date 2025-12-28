// src/profile/entities/profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Updated path

@Entity('profiles') // Updated entity name
export class Profile { // Updated class name
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  picture: string | null;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  user: User;
}
