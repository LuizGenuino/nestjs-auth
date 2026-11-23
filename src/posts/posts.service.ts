import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {

    constructor(private prismaService: PrismaService) { }

    create(createPostDto: CreatePostDto & { authorId: String }) {
        return this.prismaService.post.create({
            data: { ...createPostDto } as any,
        })
    }

    findAll() {
        return this.prismaService.post.findMany()
    }

    findOne(id: string) {
        return this.prismaService.post.findUnique({ where: { id } })
    }

    update(id: string, updatePostDto: UpdatePostDto) {
        return this.prismaService.post.update({
            where: { id },
            data: updatePostDto
        })
    }

    remove(id: string) {
        return this.prismaService.post.delete({
            where: { id }
        })
    }
}
