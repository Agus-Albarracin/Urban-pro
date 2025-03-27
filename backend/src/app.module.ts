import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';


import { Content } from './content/content.entity';
import { Course } from './course/course.entity'; 
import { User } from './user/user.entity';

import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { CourseController } from './course/course.controller';
import { StatsController } from './stats/stats.controller';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DATABASE_HOST, 
      port: +process.env.DATABASE_PORT, 
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD, 
      database: process.env.DATABASE_NAME,
      entities: [Content, Course, User],
      synchronize: process.env.NODE_ENV !== 'production',
      migrations: ['dist/migrations/*.js'],
      migrationsRun: process.env.NODE_ENV === 'production', 
    }),
    UserModule,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
    UploadModule,
  ],
  controllers: [
    UserController,
    AuthController,
    CourseController,
    StatsController,
    UploadController,
  ], 
  providers: [],
})
export class AppModule {}
