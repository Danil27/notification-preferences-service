import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Region } from '../../common/enums';
import { NotificationChannel, NotificationType } from '../../preferences/enums';
import { GlobalPolicyDecision } from '../enums';

export class CreateGlobalPolicyDto {
  @ApiProperty({
    description: 'Тип уведомления',
    enum: NotificationType,
    example: NotificationType.MARKETING_SMS,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @ApiProperty({
    description: 'Канал отправки уведомления',
    enum: NotificationChannel,
    example: NotificationChannel.SMS,
  })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({
    description: 'Регион действия политики',
    enum: Region,
    example: Region.EU,
  })
  @IsEnum(Region)
  region: Region;

  @ApiProperty({
    description: 'Решение политики',
    enum: GlobalPolicyDecision,
    example: GlobalPolicyDecision.DENY,
  })
  @IsEnum(GlobalPolicyDecision)
  decision: GlobalPolicyDecision;

  @ApiProperty({
    description: 'Причина решения политики',
    example: 'blocked_by_global_policy',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  reason: string;

  @ApiProperty({
    description: 'Флаг активности политики',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
