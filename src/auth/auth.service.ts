import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  // 비밀번호 해시 암호화
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async user(req) {
    const findedUser = await this.prisma.user.findUnique({
      where: {
        email: req.email,
      },
      include: {
        profile: true,
      },
    });
    return {
      id: findedUser.id,
      name: findedUser.name,
      email: findedUser.email,
      role: findedUser.role,
      image: findedUser.profile.image,
    };
  }
  // 회원가입
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const emailDuplicationCheck = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (emailDuplicationCheck) {
      throw new ConflictException('중복된 이메일입니다.');
    }
    const createdProfile = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
        password: hashedPassword,
        profile: {
          create: {
            bio: createUserDto.profile.bio,
            image: createUserDto.profile.image,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    return createdProfile;
  }

  // 로그인
  async signIn(signInDto: SignInDto, res: Response): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    res.setHeader('Authorization', 'Bearer ' + accessToken);

    res.cookie('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain:'127.0.0.1'
    });
    res.cookie('testCookie', 'cookieVal', {
      maxAge: 900000,
      secure: true,
      sameSite: 'none',
    });
    return res.send('success');
  }
}
