import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpsertQuietHoursDto {
  @ApiProperty({
    description: 'Время начала quiet hours в формате HH:mm',
    example: '22:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @ApiProperty({
    description: 'Время окончания quiet hours в формате HH:mm',
    example: '08:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime: string;

  @ApiProperty({
    description: 'Таймзона пользователя в формате IANA',
    example: 'Europe/Moscow',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  timezone: string;

  @ApiProperty({
    description: 'Флаг включения quiet hours',
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
