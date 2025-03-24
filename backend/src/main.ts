import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as cookieParser from 'cookie-parser';
import * as express from 'express'
import * as path from 'path'

import { AppModule } from './app.module';
import { Role } from './enums/role.enum';
import { User } from './user/user.entity';

async function createAdminOnFirstUse() {
  const admin = await User.findOne({ where: { username: 'admin' } });

  if (!admin) {
    await User.create({
      firstName: 'admin',
      lastName: 'admin',
      isActive: true,
      username: 'admin',
      role: Role.Admin,
      password: await bcrypt.hash('admin123', 10),
    }).save();
    console.log("Usuario admin creado exitosamente.");
  } else {
    console.log("El usuario 'admin' ya existe.");
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  //cors
    // Configura CORS
    app.enableCors({
      origin: 'http://localhost:5173',  // Cambia esto a la URL de tu frontend
      credentials: true,               // Permite el uso de cookies
    });

      // Servir archivos estáticos en /uploads
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Elimina o comenta estas líneas para deshabilitar Swagger
  /*
  const config = new DocumentBuilder()
    .setTitle('Carna Project API')
    .setDescription('Carna Project API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  */

  await createAdminOnFirstUse();

  await app.listen(5000, () => {
    console.log("Se inicio correctamente en el puerto 5000")
  });
}
bootstrap();
