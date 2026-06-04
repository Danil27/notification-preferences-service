import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt } from 'class-validator';
import { Region } from '../../common/enums';
import { NotificationChannel, NotificationType } from '../../preferences/enums';

export class CreateEvaluationDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Тип уведомления',
    enum: NotificationType,
    example: NotificationType.MARKETING_EMAIL,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Канал отправки уведомления',
    enum: NotificationChannel,
    example: NotificationChannel.EMAIL,
  })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({
    description: 'Регион отправки уведомления',
    enum: Region,
    example: Region.EU,
  })
  @IsEnum(Region)
  region: Region;

  @ApiProperty({
    description: 'Дата и время проверки в ISO 8601',
    example: '2026-05-21T21:30:00Z',
  })
  @IsDateString()
  datetime: string;
}
