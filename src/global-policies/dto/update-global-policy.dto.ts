import { PartialType } from '@nestjs/swagger';
import { CreateGlobalPolicyDto } from './create-global-policy.dto';

export class UpdateGlobalPolicyDto extends PartialType(CreateGlobalPolicyDto) {}
