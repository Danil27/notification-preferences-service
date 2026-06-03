import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { PreferenceEntity } from './entities/preference.entity';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceEntity, UserEntity])],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
