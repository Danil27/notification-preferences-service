import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { REGION_ENUM_NAME, Region } from '../src/common/enums';

export class UpdateUserTable1780524049811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'region',
        type: 'enum',
        enum: Object.values(Region),
        enumName: REGION_ENUM_NAME,
        default: `'${Region.US}'`,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'region');
  }
}
