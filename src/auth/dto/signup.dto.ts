
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail({})
  email: string;

  @IsOptional()
  @IsString()
  nickName?: string

  @IsString()
  @MaxLength(6)
  @MinLength(1)
  codeWord: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
  password: string;
}
