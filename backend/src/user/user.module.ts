import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Course } from '../course/course.entity'
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course]), // Asegurarse de incluir Course
    forwardRef(() => CourseModule), // Importar CourseModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}