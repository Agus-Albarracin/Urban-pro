import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

    
    async save(createCourseDto: CreateCourseDto, file: Express.Multer.File): Promise<Course> {
      const fileName = `${Date.now()}-${file.originalname}`;
      
      const filePath = path.join(__dirname, '../../uploads', fileName);
  
      await fs.promises.writeFile(filePath, file.buffer);
  
      const course = this.courseRepository.create({
        ...createCourseDto,
        dateCreated: new Date(),
        filePath,
      });
  
      return await this.courseRepository.save(course);
    }

  
    async findAll(courseQuery: CourseQuery): Promise<Course[]> {
      const courses = await this.courseRepository.find({
        where: courseQuery,
        order: { name: 'ASC', description: 'ASC' },
        relations: ['contents'],
      });
    
      return courses.map((course) => ({
        ...course,
        filePath: course.filePath 
        ? `http://localhost:5000/uploads/${path.basename(course.filePath)}`
        : null,
      }));
    }

    async findById(id: string): Promise<Course> {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['contents'],
      });
    
      if (!course) {
        throw new HttpException(
          `Could not find course with matching id ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
    
      return {
        ...course,
        filePath: course.filePath 
        ? `http://localhost:5000/uploads/${path.basename(course.filePath)}`
        : null,
      };
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
      console.log(id, updateCourseDto)
      const course = await this.findById(id);
    
      // Si updateCourseDto.filePath no existe, conservar el anterior
      const updatedCourse = {
        ...course,
        ...updateCourseDto,
        filePath: updateCourseDto.filePath 
          ? `http://localhost:5000/uploads/${path.basename(updateCourseDto.filePath)}`
          : course.filePath, // Mantiene la imagen actual si no se actualiza
      };
    
      return await this.courseRepository.save(updatedCourse);
    }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await this.courseRepository.remove(course); // Usar 'remove' para eliminar el curso
    return id;
  }

  async count(): Promise<number> {
    return await this.courseRepository.count();
  }  
  
}
