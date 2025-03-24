import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; // Multer storage

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Carpeta de destino para los archivos
        filename: (req, file, cb) => {
          const fileName = Date.now() + '-' + file.originalname;
          cb(null, fileName); // Guardar el archivo con nombre único
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
    };
  }
}
