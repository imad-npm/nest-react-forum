// src/users/dtos/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Makes all fields from CreateUserDto optional for update operations
export class UpdateUserDto extends PartialType(CreateUserDto) {}
