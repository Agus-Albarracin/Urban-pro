import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Content } from '../content/content.entity';

@Entity()
export class Course extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;
}
