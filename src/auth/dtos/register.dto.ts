import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsUnique } from 'src/validation/validators/is-unique.decorator';

export class RegisterDto {
  
  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' }, { message: 'Email must be unique' }) 
  email: string;

  @IsString()
   name: string;

  @IsString()
  @MinLength(6)
  password: string;
}
