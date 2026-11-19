import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [JwtModule.register({
    global: true, // torna o modulo global para outros modulos usar
    secret: 'secret', // -> um sistema real deve ser um hash complexo
    signOptions: {expiresIn: '2h', algorithm: 'HS256'} //adicionar o algoritmo pode evitar alguns ataques
   })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
