import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Ruta donde se almacenarán los archivos
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
