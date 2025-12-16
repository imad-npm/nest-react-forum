import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
  try {
      const user = await this.authService.validateUser(email, password);
   
      return user;
    } catch (exception) {
      // Optional: log the original error for debugging
      console.error('Auth validation error:', exception);

      // Throw generic message to client
      throw new UnauthorizedException('Invalid credentials');
    }
  
  }
}
