import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { QuietHoursEntity } from './entities/quiet-hours.entity';
import { QuietHoursService } from './quiet-hours.service';
import { QuietHoursController } from './quiet-hours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuietHoursEntity, UserEntity])],
  controllers: [QuietHoursController],
  providers: [QuietHoursService],
  exports: [QuietHoursService],
})
export class QuietHoursModule {}
