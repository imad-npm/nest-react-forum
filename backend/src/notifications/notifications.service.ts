import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationQueryDto } from './dto/notification-query.dto';

@Injectable()
export class NotificationsService {
  private readonly clients: Map<string, EventEmitter> = new Map();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  addClient(userId: string): EventEmitter {
    const emitter = new EventEmitter();
    this.clients.set(userId, emitter);
    return emitter;
  }

  removeClient(userId: string): void {
    this.clients.delete(userId);
  }

  sendNotification(userId: string, data: any): void {
    const emitter = this.clients.get(userId);
    if (emitter) {
      emitter.emit('notification', data);
    }
  }

  async findAll(
    userId: number,
    query: NotificationQueryDto,
  ): Promise<{ data: Notification[]; count: number }> {
    const { page, limit, read } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.recipient', 'recipient') // Eager load recipient
      .leftJoinAndSelect('notification.actor', 'actor')
      .where('notification.recipient.id = :userId', { userId });

    if (read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', { read });
    }

    const [data, count] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async markAsRead(notificationId: number, userId: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, recipient: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found or not accessible.`);
    }

    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<number> {
    const result = await this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('recipient.id = :userId', { userId })
      .andWhere('read = :readStatus', { readStatus: false })
      .execute();

    return result.affected || 0;
  }
}

