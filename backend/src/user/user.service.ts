import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { Role } from '../enums/role.enum';
import { UserQuery } from './user.query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Guardar un nuevo usuario
  async save(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash de la contraseña
    const { password } = createUserDto;
    createUserDto.password = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  // Obtener todos los usuarios con filtrado
  async findAll(userQuery: UserQuery): Promise<User[]> {
    Object.keys(userQuery).forEach((key) => {
      if (key !== 'role') {
        userQuery[key] = ILike(`%${userQuery[key]}%`);
      }
    });

      // Verificar si 'role', convertirlo a 'Role' si es necesario
  if (userQuery.role && typeof userQuery.role === 'string') {
    // Convertir role de string a Role
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

  // Buscar usuario por ID
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

  // Buscar usuario por nombre de usuario
  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { username },
      });
    } catch (error) {
      return null;
    }
  }

  // Actualizar usuario
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findById(id);

    // Si el nombre de usuario es el mismo que el actual, eliminarlo del DTO
    if (currentUser.username === updateUserDto.username) {
      delete updateUserDto.username;
    }

    // Si se proporciona una nueva contraseña, hacer el hash
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

    // Actualizar el usuario
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  // Eliminar usuario
  async delete(id: string): Promise<string> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return id;
  }

  // Contar usuarios
  async count(): Promise<number> {
    return this.userRepository.count();
  }

  // Establecer y guardar el refresh token
  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.update(user.id, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }
}
