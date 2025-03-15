import { ApiProperty } from "@nestjs/swagger";

export class CreateTeacherDto {
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  subjectId: string;
}
