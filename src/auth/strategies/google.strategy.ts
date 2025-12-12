import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  // profile comes from Google; map to our OAuthUser shape
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const emailObj = (profile.emails && profile.emails[0]) || {
        value: undefined,
      };
      const oauthUser = {
        provider: 'google',
        providerId: profile.id,
        email: emailObj.value,
        name: profile.displayName,
      };

      // return the object that will be available as req.user
      return done(null, oauthUser);
    } catch (err) {
      return done(err as Error, false);
    }
  }
}
