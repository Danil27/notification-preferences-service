import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Идентификатор пользователя из upstream-системы',
    example: 'user-1',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  externalId: string;
}
