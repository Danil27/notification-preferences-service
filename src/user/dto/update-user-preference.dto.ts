import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { NotificationChannel, NotificationType } from '../../preferences/enums';

export class UpdateUserPreferenceDto {
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
    description: 'Флаг включения уведомления',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  isEnabled: boolean;
}
