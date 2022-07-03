import { JWT_AUTH_SERVICE } from './constants/auth.constants';
import { JwtStrategy } from './strategies/jtw.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { forwardRef, Module } from '@nestjs/common';
import { JwtAuthService } from './services/auth.service';
import { AppModule } from '../app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2629800000' },
    }),
  ],
  providers: [{ provide: JWT_AUTH_SERVICE, useClass: JwtAuthService }, LocalStrategy, JwtStrategy],
  exports: [{ provide: JWT_AUTH_SERVICE, useClass: JwtAuthService }, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
