import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseModule } from '../course/course.module';
import { ContentService } from './content.service';
import { Content } from './content.entity'

@Module({
  imports: [
    forwardRef(() => CourseModule),  // Usar forwardRef si hay dependencia circular
    TypeOrmModule.forFeature([Content]),  
  ],
  controllers: [],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
