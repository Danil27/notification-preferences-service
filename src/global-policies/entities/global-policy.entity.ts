import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { REGION_ENUM_NAME, Region } from '../../common/enums';
import {
  NotificationChannel,
  NotificationType,
  USER_PREFERENCE_CHANNEL_ENUM_NAME,
  USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
} from '../../preferences/enums';
import {
  GLOBAL_POLICY_DECISION_ENUM_NAME,
  GlobalPolicyDecision,
} from '../enums';

@Entity({ name: 'global_policies' })
@Unique('uq_global_policies_type_channel_region', [
  'notificationType',
  'channel',
  'region',
])
export class GlobalPolicyEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.MARKETING_SMS,
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
    example: NotificationChannel.SMS,
  })
  @Column({
    name: 'channel',
    type: 'enum',
    enum: NotificationChannel,
    enumName: USER_PREFERENCE_CHANNEL_ENUM_NAME,
  })
  channel: NotificationChannel;

  @ApiProperty({ enum: Region, example: Region.EU })
  @Column({
    name: 'region',
    type: 'enum',
    enum: Region,
    enumName: REGION_ENUM_NAME,
  })
  region: Region;

  @ApiProperty({
    enum: GlobalPolicyDecision,
    example: GlobalPolicyDecision.DENY,
  })
  @Column({
    name: 'decision',
    type: 'enum',
    enum: GlobalPolicyDecision,
    enumName: GLOBAL_POLICY_DECISION_ENUM_NAME,
  })
  decision: GlobalPolicyDecision;

  @ApiProperty({ example: 'blocked_by_global_policy', maxLength: 100 })
  @Column({ name: 'reason', type: 'varchar', length: 100 })
  reason: string;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
