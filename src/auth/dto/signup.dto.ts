import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsEmail({})
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(6)
  @MinLength(1)
  codeWord: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
  password: string;
}
