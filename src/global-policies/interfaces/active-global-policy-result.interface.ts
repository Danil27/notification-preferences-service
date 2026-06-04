import { GlobalPolicyDecision } from '../enums/global-policy-decision.enum';

export interface ActiveGlobalPolicyResult {
  decision: GlobalPolicyDecision;
  reason: string;
}
