import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequiredRoles } from '../auth/required-roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { RoleGuard } from '../auth/role/role.guard.js';

@UseGuards(AuthGuard, RoleGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @RequiredRoles(Role.WRITER, Role.EDITOR)
    @Post()
    create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        return this.postsService.create({ ...createPostDto, authorId: req.user!.id });
    }

    @RequiredRoles(Role.WRITER, Role.EDITOR, Role.READER)
    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @RequiredRoles(Role.WRITER, Role.EDITOR, Role.READER)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @RequiredRoles(Role.WRITER, Role.EDITOR)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @RequiredRoles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
