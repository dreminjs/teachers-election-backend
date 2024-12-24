import { IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Название предмета не может быть пустым' })
  @Min(3, { message: 'Название предмета должно быть не менее 3 символов' })
  @MaxLength(100, { message: 'Название предмета не должно превышать 100 символов' })
  title: string;
}
