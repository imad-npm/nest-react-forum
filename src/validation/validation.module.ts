import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IsUnique } from './validators/is-unique.decorator';
import { IsUniqueConstraint } from './validators/is-unique-constraint.validator';

@Module({
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
  
    imports: [
    TypeOrmModule.forFeature([User]),
    ] // ✅ import all entities you plan to validate
    })
export class ValidationModule {}
