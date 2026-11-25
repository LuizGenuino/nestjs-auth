import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt'
import { packRules } from '@casl/ability/extra';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service.js';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService,
        private prismaService: PrismaService,
        private abilityService: CaslAbilityService
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: loginDto.email }
        })

        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password)

        if (!isPasswordValid) {
            throw new Error("Invalid Credentials")
        }

        const ability = this.abilityService.createForUser(user)
        const token = this.jwtService.sign({
            sub: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            permission: packRules(ability.rules)
        })

        return { access_token: token }
    }
}
