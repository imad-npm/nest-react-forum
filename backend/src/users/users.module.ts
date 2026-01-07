import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Add ProfileModule here
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule.forFeature([User]), UsersService], // Export the service and TypeOrmFeature so it can be injected elsewhere
})
export class UsersModule {}
