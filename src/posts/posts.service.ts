import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service.js';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PostsService {

    constructor(
        private prismaService: PrismaService,
        private abilityService: CaslAbilityService // importa a instancia criada para o usuario no auth.guard.ts
    ) { }


    create(createPostDto: CreatePostDto & { authorId: String }) {
        const ability = this.abilityService.ability

        if (!ability.can('create', 'Post')) {
            throw new ForbiddenException('Anauthorized')
        }

        return this.prismaService.post.create({
            data: { ...createPostDto } as any,
        })
    }

    findAll() {
        const ability = this.abilityService.ability

        return this.prismaService.post.findMany({
            where: {
                AND: [accessibleBy(ability, 'read').ofType('Post')]
            }
        })
    }

    async findOne(id: string) {
        const ability = this.abilityService.ability

        const posts = await this.prismaService.post.findUnique({
            where: {
                id,
                AND: [accessibleBy(ability, 'read').ofType('Post')]
            }
        })

        if (!posts) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }

        return posts
    }

    async update(id: string, updatePostDto: UpdatePostDto) {

        await this.findOne(id)

        const ability = this.abilityService.ability

        return this.prismaService.post.update({
            where: {
                id,
                AND: [accessibleBy(ability, 'update').ofType('Post')]
            },
            data: updatePostDto
        })
    }

    async remove(id: string) {
        console.log('passou 1')
        await this.findOne(id)

        console.log('passou 2')

        const ability = this.abilityService.ability

        return this.prismaService.post.delete({
            where: {
                id,
                AND: [accessibleBy(ability, 'delete').ofType('Post')]
            }
        })
    }
}
