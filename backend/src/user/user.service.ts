import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { Role } from '../enums/role.enum';
import { UserQuery } from './user.query';
import { Course } from '../course/course.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) {}

  async save(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);
    
    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password } = createUserDto;
    createUserDto.password = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    Object.keys(userQuery).forEach((key) => {
      if (key !== 'role') {
        userQuery[key] = ILike(`%${userQuery[key]}%`);
      }
    });

  if (userQuery.role && typeof userQuery.role === 'string') {
    userQuery.role = userQuery.role as Role;
  }
    
    return this.userRepository.find({
      where: userQuery,
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({where: { id } });
    } catch (error) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { username },
      });
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findById(id);

    if (currentUser.username === updateUserDto.username) {
      delete updateUserDto.username;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new HttpException(
          `User with username ${updateUserDto.username} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<string> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return id;
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.update(user.id, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }


  async subscribeUserToCourse(username: string, name: string) {
    const user = await this.userRepository.findOne({ where: { username: username } });
    const course = await this.courseRepository.findOne({ where: { name: name} });
  
    if (!user || !course) {
      throw new Error('Usuario o curso no encontrado');
    }
  
    user.courses = [...user.courses, course];
    await user.save();
  
    console.log(`El usuario ${user.username} se ha suscrito al curso ${course.name}`);
    return { message: 'El usuario se ha suscrito al curso correctamente', status: 200 };
  }
}
