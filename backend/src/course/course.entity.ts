import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Content } from '../content/content.entity';
import { User } from '../user/user.entity';

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

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;
}
