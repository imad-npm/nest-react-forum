import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Only run passport when there's an Authorization header (or cookie extractor)
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers?.authorization;

    // If no auth header, allow anonymously
    if (!authHeader) {
      return true;
    }

    // If header exists, run the normal jwt guard which will call validate()
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  // handleRequest receives (err, user, info)
  handleRequest(err: any, user: any, info: any) {
    // log details to debug why authentication failed
    if (info) {
      console.log('OptionalJwtAuthGuard - passport info:', info);
    }
    if (err) {
      // real error (e.g. DB lookup failed) — rethrow
      throw err;
    }

    // If passport failed to authenticate it may pass `false` or `undefined` here.
    // We want to silence that and allow anonymous access, so return null in that case.
    if (!user) {
      return null;
    }

    // Auth succeeded
    return user;
  }
}
