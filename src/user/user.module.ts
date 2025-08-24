import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'your-secret-key', // use env variable in production
    signOptions: { expiresIn: '1d' },
  }),
],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
