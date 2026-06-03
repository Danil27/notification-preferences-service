import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configurationFactory, typeOrmConfigFactory } from './config';
import { UserModule } from './user/user.module';
import { PreferencesModule } from './preferences/preferences.module';
import { QuietHoursModule } from './quiet-hours/quiet-hours.module';
import { GlobalPoliciesModule } from './global-policies/global-policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configurationFactory],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    UserModule,
    PreferencesModule,
    QuietHoursModule,
    GlobalPoliciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
