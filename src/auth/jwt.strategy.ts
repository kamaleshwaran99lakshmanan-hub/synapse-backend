import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // We use 'as string' to tell TS: "Trust me, I know what I'm doing."
      // We also add a fallback || 'secret' so the app doesn't crash if .env fails.
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecretKey123',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // This attaches the user ID and email to the 'req.user' object
    return { id: payload.sub, email: payload.email };
  }
}