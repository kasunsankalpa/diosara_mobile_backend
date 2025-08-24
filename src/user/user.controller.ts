import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';

@Controller('user')
export class UserController {
    constructor(private  readonly service: UserService){}

    @Post('register')
    register(@Body() dto: CreateUserDto) {
      return this.service.create(dto);
    }
  
    @Post('login')
    login(@Body() dto: LoginUserDto) {
      return this.service.login(dto);
    }
}
