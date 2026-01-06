import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class NotificationsService {
  private readonly clients: Map<string, EventEmitter> = new Map();

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
}
