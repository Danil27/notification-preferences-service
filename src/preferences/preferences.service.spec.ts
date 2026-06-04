import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DEFAULT_USER_PREFERENCES } from './default-preferences';
import { PreferenceEntity } from './entities/preference.entity';
import { NotificationChannel, NotificationType } from './enums';
import { PreferencesService } from './preferences.service';

type PreferenceRepositoryMock = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

type UserRepositoryMock = {
  findOne: jest.Mock;
};

describe('PreferencesService', () => {
  let service: PreferencesService;
  let preferenceRepository: PreferenceRepositoryMock;
  let userRepository: UserRepositoryMock;

  beforeEach(() => {
    preferenceRepository = {
      findOne: jest.fn(),
      create: jest.fn((payload: PreferenceEntity) => payload),
      save: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
    };

    service = new PreferencesService(
      preferenceRepository as unknown as Repository<PreferenceEntity>,
      userRepository as unknown as Repository<UserEntity>,
    );
  });

  it('creates default preferences for user', async () => {
    const preferences = DEFAULT_USER_PREFERENCES.map((preference) => ({
      userId: 1,
      ...preference,
    }));

    preferenceRepository.save.mockResolvedValue(preferences);

    await expect(service.createDefaultPreferences(1)).resolves.toEqual(
      preferences,
    );
    expect(preferenceRepository.save).toHaveBeenCalledWith(preferences);
  });

  it('returns existing preference without saving when value is unchanged', async () => {
    const preference = {
      id: 1,
      userId: 1,
      notificationType: NotificationType.MARKETING_EMAIL,
      channel: NotificationChannel.EMAIL,
      isEnabled: false,
    } as PreferenceEntity;

    userRepository.findOne.mockResolvedValue({
      id: 1,
    });
    preferenceRepository.findOne.mockResolvedValue(preference);

    await expect(
      service.setUserPreference(1, {
        notificationType: NotificationType.MARKETING_EMAIL,
        channel: NotificationChannel.EMAIL,
        isEnabled: false,
      }),
    ).resolves.toEqual(preference);
    expect(preferenceRepository.save).not.toHaveBeenCalled();
  });

  it('throws not found when user does not exist', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.findByUserId(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
