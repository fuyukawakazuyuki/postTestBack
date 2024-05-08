import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: createPostDto.authorId,
        boardId: createPostDto.boardId,
      },
    });
    return createdPost;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const findedPost = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    return findedPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,

      },
    });
    return updatedPost;
  }

  async remove(id: number): Promise<Post> {
    const deletedPost = await this.prisma.post.delete({
      where: {
        id: id,
      },
    });
    return deletedPost;
  }
}
