import { Test, TestingModule } from '@nestjs/testing';
import { GlobalPoliciesController } from './global-policies.controller';
import { GlobalPoliciesService } from './global-policies.service';

describe('GlobalPoliciesController', () => {
  let controller: GlobalPoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalPoliciesController],
      providers: [GlobalPoliciesService],
    }).compile();

    controller = module.get<GlobalPoliciesController>(GlobalPoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
