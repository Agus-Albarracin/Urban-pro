import { forwardRef, Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => ContentModule),  // Usar forwardRef si hay dependencia circular
    TypeOrmModule.forFeature([Course]), 
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
