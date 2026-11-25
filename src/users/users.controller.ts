import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RoleGuard } from '../auth/role/role.guard.js';
import { RequiredRoles } from '../auth/required-roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard, RoleGuard)
    @RequiredRoles(Role.ADMIN)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard, RoleGuard)
    @RequiredRoles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(AuthGuard, RoleGuard)
    @RequiredRoles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(AuthGuard, RoleGuard)
    @RequiredRoles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
