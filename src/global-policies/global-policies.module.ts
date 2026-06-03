import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import { GlobalPoliciesService } from './global-policies.service';
import { GlobalPoliciesController } from './global-policies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalPolicyEntity])],
  controllers: [GlobalPoliciesController],
  providers: [GlobalPoliciesService],
  exports: [GlobalPoliciesService],
})
export class GlobalPoliciesModule {}
