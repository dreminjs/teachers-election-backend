import { IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Название предмета не может быть пустым' })
  @MinLength(3, { message: 'Название предмета должно быть не менее 3 символов' })
  @MaxLength(100, { message: 'Название предмета не должно превышать 100 символов' })
  title: string;
}
