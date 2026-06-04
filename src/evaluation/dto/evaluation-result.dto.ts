import { ApiProperty } from '@nestjs/swagger';
import { GlobalPolicyDecision } from '../../global-policies/enums/global-policy-decision.enum';

export class EvaluationResultDto {
  @ApiProperty({
    description: 'Решение о возможности отправки уведомления',
    enum: GlobalPolicyDecision,
    example: GlobalPolicyDecision.DENY,
  })
  decision: GlobalPolicyDecision;

  @ApiProperty({
    description: 'Причина решения',
    example: 'blocked_by_global_policy',
  })
  reason: string;
}
