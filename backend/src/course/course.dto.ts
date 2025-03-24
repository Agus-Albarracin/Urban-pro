import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  startDate?: Date;

  @IsNotEmpty()
  @IsOptional()
  filePath?: any;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsOptional()
  filePath?: any;
}
