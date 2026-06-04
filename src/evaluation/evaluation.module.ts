import { Module } from '@nestjs/common';
import { GlobalPoliciesModule } from '../global-policies/global-policies.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { QuietHoursModule } from '../quiet-hours/quiet-hours.module';
import { UserModule } from '../user/user.module';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [
    UserModule,
    PreferencesModule,
    QuietHoursModule,
    GlobalPoliciesModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
