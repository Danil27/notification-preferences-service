import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { REGION_ENUM_NAME, Region } from '../../common/enums';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 'user-1', maxLength: 100 })
  @Column({
    name: 'external_id',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  externalId: string;

  @ApiProperty({ enum: Region, example: Region.EU })
  @Column({
    name: 'region',
    type: 'enum',
    enum: Region,
    enumName: REGION_ENUM_NAME,
    default: Region.US,
  })
  region: Region;

  @ApiProperty({ example: '2026-06-03T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
