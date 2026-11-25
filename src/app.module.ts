import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CaslModule } from './casl/casl.module.js';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }),UsersModule, PrismaModule, AuthModule, PostsModule, CaslModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
