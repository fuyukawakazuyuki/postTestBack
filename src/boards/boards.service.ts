import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma.service';
import { Board, Post } from '@prisma/client';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

 
  async create(createBoardDto: CreateBoardDto) {
    const createdBoard = await this.prisma.board.create({
      data:{
        name: createBoardDto.name,     
      },
    })
    return createdBoard;
  }

  async findPosts(id:number){
    console.log(id);
    const findPosts = await this.prisma.board.findUnique({
      where: {
        id: id,
      },
      include:{
        posts:true,
      }
    });
    return findPosts; 
  }

  async findAll():Promise<Board[]> {
    const boards = await this.prisma.board.findMany()
    return boards;
  }

  async findOne(id: number):Promise<Board> {
    const findedBoard = await this.prisma.board.findUnique({
      where: {
        id: id,
      }
    })
    return findedBoard;

  }

  async update(id: number, updateBoardDto: UpdateBoardDto):Promise<Board> {
    const updatedBoard = await this.prisma.board.update({
      where: {
        id: id,
      },
      data: {
        name: updateBoardDto.name,
      },
    })
    return updatedBoard;
  }

  async remove(id: number):Promise<Board> {
    const deletedBoard = await this.prisma.board.delete({
      where: {
        id: id,
      },
    })
    return deletedBoard
  }
}
