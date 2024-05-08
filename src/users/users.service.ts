import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

 

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number): Promise<User> {
    const findedUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return findedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,

      },
    });
    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return deletedUser;
  }
}
