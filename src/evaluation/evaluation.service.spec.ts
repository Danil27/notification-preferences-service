import { Region } from '../common/enums';
import { GlobalPolicyDecision } from '../global-policies/enums/global-policy-decision.enum';
import { GlobalPoliciesService } from '../global-policies/global-policies.service';
import { NotificationChannel, NotificationType } from '../preferences/enums';
import { PreferencesService } from '../preferences/preferences.service';
import { QuietHoursService } from '../quiet-hours/quiet-hours.service';
import { UserService } from '../user/user.service';
import { EvaluationService } from './evaluation.service';

type UserServiceMock = {
  findOne: jest.Mock;
};

type PreferencesServiceMock = {
  findOneByUserAndNotification: jest.Mock;
};

type QuietHoursServiceMock = {
  findOptionalByUserId: jest.Mock;
};

type GlobalPoliciesServiceMock = {
  findActivePolicy: jest.Mock;
};

describe('EvaluationService', () => {
  let service: EvaluationService;
  let userService: UserServiceMock;
  let preferencesService: PreferencesServiceMock;
  let quietHoursService: QuietHoursServiceMock;
  let globalPoliciesService: GlobalPoliciesServiceMock;

  const dto = {
    userId: 1,
    notificationType: NotificationType.MARKETING_EMAIL,
    channel: NotificationChannel.EMAIL,
    region: Region.EU,
    datetime: '2026-05-21T21:30:00Z',
  };

  beforeEach(() => {
    userService = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
      }),
    };
    preferencesService = {
      findOneByUserAndNotification: jest.fn().mockResolvedValue(null),
    };
    quietHoursService = {
      findOptionalByUserId: jest.fn().mockResolvedValue(null),
    };
    globalPoliciesService = {
      findActivePolicy: jest.fn().mockResolvedValue(null),
    };

    service = new EvaluationService(
      userService as unknown as UserService,
      preferencesService as unknown as PreferencesService,
      quietHoursService as unknown as QuietHoursService,
      globalPoliciesService as unknown as GlobalPoliciesService,
    );
  });

  it('returns active global policy decision first', async () => {
    globalPoliciesService.findActivePolicy.mockResolvedValue({
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_global_policy',
    });

    await expect(service.evaluate(dto)).resolves.toEqual({
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_global_policy',
    });
    expect(
      preferencesService.findOneByUserAndNotification,
    ).not.toHaveBeenCalled();
  });

  it('denies when user preference is disabled', async () => {
    preferencesService.findOneByUserAndNotification.mockResolvedValue({
      isEnabled: false,
    });

    await expect(service.evaluate(dto)).resolves.toEqual({
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_user_preference',
    });
  });

  it('denies marketing push during quiet hours', async () => {
    quietHoursService.findOptionalByUserId.mockResolvedValue({
      startTime: '22:00:00',
      endTime: '08:00:00',
      timezone: 'UTC',
      isEnabled: true,
    });

    await expect(
      service.evaluate({
        ...dto,
        notificationType: NotificationType.MARKETING_PUSH,
        channel: NotificationChannel.PUSH,
        datetime: '2026-05-21T23:30:00Z',
      }),
    ).resolves.toEqual({
      decision: GlobalPolicyDecision.DENY,
      reason: 'blocked_by_quiet_hours',
    });
  });
});
