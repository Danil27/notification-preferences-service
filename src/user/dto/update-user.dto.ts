import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Region } from '../../common/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Идентификатор пользователя из upstream-системы',
    example: 'user-1',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  externalId?: string;

  @ApiPropertyOptional({
    description: 'Регион пользователя',
    enum: Region,
    example: Region.EU,
  })
  @IsEnum(Region)
  @IsOptional()
  region?: Region;
}
