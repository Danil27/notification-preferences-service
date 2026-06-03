import { Test, TestingModule } from '@nestjs/testing';
import { QuietHoursService } from './quiet-hours.service';

describe('QuietHoursService', () => {
  let service: QuietHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuietHoursService],
    }).compile();

    service = module.get<QuietHoursService>(QuietHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
