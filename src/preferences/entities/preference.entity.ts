import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import {
  NotificationChannel,
  NotificationType,
  USER_PREFERENCE_CHANNEL_ENUM_NAME,
  USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
} from '../enums';

@Entity({ name: 'user_preferences' })
@Unique('uq_user_preferences_user_type_channel', [
  'userId',
  'notificationType',
  'channel',
])
export class PreferenceEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.MARKETING_EMAIL,
  })
  @Column({
    name: 'notification_type',
    type: 'enum',
    enum: NotificationType,
    enumName: USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
  })
  notificationType: NotificationType;

  @ApiProperty({
    enum: NotificationChannel,
    example: NotificationChannel.EMAIL,
  })
  @Column({
    name: 'channel',
    type: 'enum',
    enum: NotificationChannel,
    enumName: USER_PREFERENCE_CHANNEL_ENUM_NAME,
  })
  channel: NotificationChannel;

  @ApiProperty({ example: false })
  @Column({ name: 'is_enabled', type: 'boolean' })
  isEnabled: boolean;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
