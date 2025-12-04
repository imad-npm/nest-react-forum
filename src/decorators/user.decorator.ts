import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';


/**
 * Custom parameter decorator to inject the authenticated user into a controller handler.
 * NOTE: This is a temporary implementation that fetches a hardcoded User (ID 1)
 * from the UsersService for demonstration purposes.
 * In a real application, the user would be extracted from the request (e.g., from a JWT payload).
 */
export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<User> => {
    const request = ctx.switchToHttp().getRequest();
    const app = request.app; // Get NestJS application instance (required for manual service lookup)
    
    // Manually fetch the UsersService instance from the application context
    const usersService = app.get(UsersService);
    
    // --------------------------------------------------------------------
    // TEMPORARY LOGIC: Hardcode fetching User ID 1
    // In a real app, this would be:
    // const userId = request.user.id; 
    // const user = await usersService.findOneById(userId);
    // --------------------------------------------------------------------
    
    const MOCK_USER_ID = 1;
    const user = await usersService.findOneById(MOCK_USER_ID);
    
    return user;
  },
);
