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

@Entity({ name: 'user_quiet_hours' })
@Unique('uq_user_quiet_hours_user_id', ['userId'])
export class QuietHoursEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ example: '22:00' })
  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @ApiProperty({ example: '08:00' })
  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @ApiProperty({ example: 'Europe/Moscow' })
  @Column({ name: 'timezone', type: 'varchar', length: 100 })
  timezone: string;

  @ApiProperty({ example: true })
  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-04T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
