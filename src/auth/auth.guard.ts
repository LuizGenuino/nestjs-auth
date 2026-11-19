import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, private prismaService: PrismaService) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(" ")[1] // o ? valida se o dado existe antes prosseguir; split(" ") separa a string em um array em cada espaço; [1] pego a segunda posição do array

        if (!token) {
            throw new UnauthorizedException('No token provided')
        }

        try {
            const payload = this.jwtService.verify<{
                sub: string, role: string, name: string, email: string
            }>(token, { algorithms: ['HS256'] })

            const user = await this.prismaService.user.findUnique({
                where: { id: payload.sub }
            })

            if(!user){
                throw new UnauthorizedException("User not found")
            }

            request.user = user

            return true
        } catch (e) {
            console.error(e)
            throw new UnauthorizedException('Invalid token', { cause: e })
        }

        return true;
    }
}
