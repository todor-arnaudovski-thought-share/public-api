import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { User, UserSchema } from '../models/users/schemas/user.schema';
import { UsersModule } from '../models/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: {
        expiresIn: '15min',
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
