import {
  Controller,
  Get,
  Sse,
  UseGuards,
  Req,
  Res,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
  // backend/src/notifications/notifications.controller.ts
import { interval, merge } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { QueryJwtAuthGuard } from 'src/auth/guards/query-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Import JwtAuthGuard
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

 @Sse('sse')
  @UseGuards(QueryJwtAuthGuard)
  sse(
    @GetUser() user: User,
    @Req() req,
  ) {
    const emitter = this.notificationsService.addClient(
      user.id.toString(),
    );

    req.on('close', () => {
      this.notificationsService.removeClient(user.id.toString());
    });

    // 🔥 Keep-alive ping for Firefox
    const keepAlive$ = interval(15000).pipe(
      map(() => ({ type: 'ping' })),
    );

    const notifications$ = fromEvent(emitter, 'notification');

    return merge(keepAlive$, notifications$).pipe(
      map((data) => ({
        data,
      })),
    );
  }
    @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @GetUser() user: User,
    @Query() query: NotificationQueryDto,
  ): Promise<PaginatedResponseDto<NotificationResponseDto>> {
    const { data, count } = await this.notificationsService.findAll(
      user.id,
      query,
    );

    const paginationMeta = new PaginationMetaDto(
      query.page,
      query.limit,
      count,
      data.length,
    );

    return new PaginatedResponseDto(
      data.map(NotificationResponseDto.fromEntity),
      paginationMeta,
    );
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<ResponseDto<NotificationResponseDto>> {
    const notification = await this.notificationsService.markAsRead(
      notificationId,
      user.id,
    );
    return new ResponseDto(NotificationResponseDto.fromEntity(notification));
  }

  @Patch('mark-all-as-read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@GetUser() user: User): Promise<void> {
    await this.notificationsService.markAllAsRead(user.id);
  }

}
