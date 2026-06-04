import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Region } from '../common/enums';
import { NotificationChannel, NotificationType } from '../preferences/enums';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import { GlobalPolicyDecision } from './enums/global-policy-decision.enum';
import { GlobalPoliciesService } from './global-policies.service';

type GlobalPolicyRepositoryMock = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

describe('GlobalPoliciesService', () => {
  let service: GlobalPoliciesService;
  let globalPolicyRepository: GlobalPolicyRepositoryMock;

  beforeEach(() => {
    globalPolicyRepository = {
      findOne: jest.fn(),
      create: jest.fn((payload: GlobalPolicyEntity) => payload),
      save: jest.fn(),
    };

    service = new GlobalPoliciesService(
      globalPolicyRepository as unknown as Repository<GlobalPolicyEntity>,
    );
  });

  it('creates active policy by default', async () => {
    const dto = {
      notificationType: NotificationType.MARKETING_SMS,
      channel: NotificationChannel.SMS,
      region: Region.EU,
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_global_policy',
    };

    globalPolicyRepository.findOne.mockResolvedValue(null);
    globalPolicyRepository.save.mockImplementation(
      (entity: GlobalPolicyEntity) => Promise.resolve(entity),
    );

    await expect(service.create(dto)).resolves.toMatchObject({
      ...dto,
      isActive: true,
    });
  });

  it('throws conflict when policy key already exists', async () => {
    globalPolicyRepository.findOne.mockResolvedValue({
      id: 1,
    });

    await expect(
      service.create({
        notificationType: NotificationType.MARKETING_SMS,
        channel: NotificationChannel.SMS,
        region: Region.EU,
        decision: GlobalPolicyDecision.DENY,
        reason: 'blocked_by_global_policy',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('finds active policy by notification key', async () => {
    const policy = {
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_global_policy',
    };

    globalPolicyRepository.findOne.mockResolvedValue(policy);

    await expect(
      service.findActivePolicy({
        notificationType: NotificationType.MARKETING_SMS,
        channel: NotificationChannel.SMS,
        region: Region.EU,
      }),
    ).resolves.toEqual({
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_global_policy',
    });
    expect(globalPolicyRepository.findOne).toHaveBeenCalledWith({
      select: {
        decision: true,
        reason: true,
      },
      where: {
        notificationType: NotificationType.MARKETING_SMS,
        channel: NotificationChannel.SMS,
        region: Region.EU,
        isActive: true,
      },
    });
  });
});
