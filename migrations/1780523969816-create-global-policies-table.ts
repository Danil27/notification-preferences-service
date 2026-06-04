import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';
import { REGION_ENUM_NAME, Region } from '../src/common/enums';
import {
  GLOBAL_POLICY_DECISION_ENUM_NAME,
  GlobalPolicyDecision,
} from '../src/global-policies/enums/global-policy-decision.enum';
import {
  NotificationChannel,
  NotificationType,
  USER_PREFERENCE_CHANNEL_ENUM_NAME,
  USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
} from '../src/preferences/enums';

export class CreateGlobalPoliciesTable1780523969816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'global_policies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'notification_type',
            type: 'enum',
            enum: Object.values(NotificationType),
            enumName: USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
            isNullable: false,
          },
          {
            name: 'channel',
            type: 'enum',
            enum: Object.values(NotificationChannel),
            enumName: USER_PREFERENCE_CHANNEL_ENUM_NAME,
            isNullable: false,
          },
          {
            name: 'region',
            type: 'enum',
            enum: Object.values(Region),
            enumName: REGION_ENUM_NAME,
            isNullable: false,
          },
          {
            name: 'decision',
            type: 'enum',
            enum: Object.values(GlobalPolicyDecision),
            enumName: GLOBAL_POLICY_DECISION_ENUM_NAME,
            isNullable: false,
          },
          {
            name: 'reason',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'uq_global_policies_type_channel_region',
            columnNames: ['notification_type', 'channel', 'region'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('global_policies', true);
  }
}
