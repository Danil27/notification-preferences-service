import { Test, TestingModule } from '@nestjs/testing';
import { GlobalPoliciesService } from './global-policies.service';

describe('GlobalPoliciesService', () => {
  let service: GlobalPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalPoliciesService],
    }).compile();

    service = module.get<GlobalPoliciesService>(GlobalPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
