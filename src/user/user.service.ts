import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
        private jwtService: JwtService,
    )
    {}

    async create(dto: CreateUserDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.repo.create({ ...dto, password: hashed });
        return this.repo.save(user);
      }
    
      async login(dto: LoginUserDto) {
        const user = await this.repo.findOne({ where: { username: dto.username } });
        if (!user) throw new UnauthorizedException('Invalid credentials');
    
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    
        const payload = { sub: user.id, username: user.username, role: user.role };
        const token = await this.jwtService.sign(payload,{secret: 'your_jwt_secret_here', expiresIn: '1h'});
        return { access_token: token };
      }
}
