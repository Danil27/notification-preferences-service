import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { Region } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Идентификатор пользователя из upstream-системы',
    example: 'user-1',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  externalId: string;

  @ApiProperty({
    description: 'Регион пользователя',
    enum: Region,
    example: Region.EU,
  })
  @IsEnum(Region)
  region: Region;
}
