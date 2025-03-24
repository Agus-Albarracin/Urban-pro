import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // Importa TypeOrmModule
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';  // Importa la entidad User

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Asegúrate de registrar el repositorio aquí
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}