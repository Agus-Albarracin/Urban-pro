import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';  
import { Course } from '../course/course.entity';   

@Entity()
export class Content extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  
  @Column()
  profesional: string;

  @ManyToOne(() => Course, (course) => course.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;
}
