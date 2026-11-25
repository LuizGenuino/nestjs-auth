import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../generated/prisma/enums.js';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) { } // permite extrair decorator das estruturas

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler()) // identificador do decorator | metodo do controller que esta sendo executado

        if (!requiredRoles) {
            return true
        }

        const request: Request = context.switchToHttp().getRequest()
        const authUser = request.user

        return authUser!.role === Role.ADMIN || requiredRoles.includes(authUser!.role)
    }
}
