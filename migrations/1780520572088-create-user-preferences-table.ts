import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';
import {
  NotificationChannel,
  NotificationType,
  USER_PREFERENCE_CHANNEL_ENUM_NAME,
  USER_PREFERENCE_NOTIFICATION_TYPE_ENUM_NAME,
} from '../src/preferences/enums';

export class CreateUserPreferencesTable1780520572088 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_preferences',
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
            name: 'user_id',
            type: 'int',
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
            name: 'is_enabled',
            type: 'boolean',
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
            name: 'uq_user_preferences_user_type_channel',
            columnNames: ['user_id', 'notification_type', 'channel'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_user_preferences_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_preferences', true);
  }
}
