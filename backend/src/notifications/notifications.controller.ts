import { Controller, Get, Sse, UseGuards, Req, Res } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('sse')
  @UseGuards(JwtAuthGuard)
  sse(
    @GetUser() user: User,
    @Req() req,
    @Res() res: Response,
  ): Observable<MessageEvent> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const eventEmitter = this.notificationsService.addClient(user.id.toString());

    req.on('close', () => {
      this.notificationsService.removeClient(user.id.toString());
    });

    return fromEvent(eventEmitter, 'notification').pipe(
      map((data: any) => {
        return new MessageEvent('notification', { data });
      }),
    );
  }
}
