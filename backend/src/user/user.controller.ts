import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';
import { UserService } from './user.service';
import { UpdateCourseDto } from '../course/course.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto)
    return await this.userService.save(createUserDto);
  }

  @Post('/addCourse')
  @Roles(Role.User)
  async suscribeUserToCourse(
    // Enviamos el username para identificar ya que el ts indica que id no esta en el archivo dto
    // id, se extiende de base.entity por lo que no es necesario volver a reeinscribir en el dto
    // de igual manera sigue el mismo error. lo mismo pasa para User como para Course.
    @Body() updateUserDto: UpdateUserDto, 
    @Body() updateCourseDto: UpdateCourseDto
  ): Promise<{ message: string, status: number }> {
    try {
      
      await this.userService.subscribeUserToCourse(updateUserDto.username, updateCourseDto.name);
  
      return { message: 'Usuario suscrito al curso con éxito', status: 200 };
    } catch (error) {
      return { message: `Error: ${error.message}`, status: 500 };
    }
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() userQuery: UserQuery): Promise<User[]> {
    return await this.userService.findAll(userQuery);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(id);
  }
}
