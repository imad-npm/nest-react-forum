import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class QueryJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // Look for the token in the 'token' query parameter
    if (request.query && request.query.token) {
      request.headers.authorization = `Bearer ${request.query.token}`;
    }
    return request;
  }
}
