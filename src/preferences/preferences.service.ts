import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import {
  DEFAULT_USER_PREFERENCES,
  DefaultPreference,
} from './default-preferences';
import { PreferenceEntity } from './entities/preference.entity';
import { NotificationChannel, NotificationType } from './enums';

export interface SetPreferenceCommand {
  notificationType: NotificationType;
  channel: NotificationChannel;
  isEnabled: boolean;
}

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(PreferenceEntity)
    private readonly preferenceRepository: Repository<PreferenceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createDefaultPreferences(
    userId: number,
    manager?: EntityManager,
  ): Promise<PreferenceEntity[]> {
    const preferenceRepository = this.getPreferenceRepository(manager);
    const defaultPreferences = DEFAULT_USER_PREFERENCES.map((preference) =>
      this.createPreferenceEntity(userId, preference, preferenceRepository),
    );

    return preferenceRepository.save(defaultPreferences);
  }

  async findByUserId(userId: number): Promise<PreferenceEntity[]> {
    await this.assertUserExists(userId);

    return this.preferenceRepository.find({
      where: {
        userId,
      },
      order: {
        notificationType: 'ASC',
        channel: 'ASC',
      },
    });
  }

  async setUserPreference(
    userId: number,
    command: SetPreferenceCommand,
  ): Promise<PreferenceEntity> {
    await this.assertUserExists(userId);

    const preference = await this.preferenceRepository.findOne({
      where: {
        userId,
        notificationType: command.notificationType,
        channel: command.channel,
      },
    });

    if (preference) {
      if (preference.isEnabled === command.isEnabled) {
        return preference;
      }

      preference.isEnabled = command.isEnabled;
      return this.preferenceRepository.save(preference);
    }

    return this.preferenceRepository.save(
      this.preferenceRepository.create({
        userId,
        notificationType: command.notificationType,
        channel: command.channel,
        isEnabled: command.isEnabled,
      }),
    );
  }

  private getPreferenceRepository(
    manager?: EntityManager,
  ): Repository<PreferenceEntity> {
    return (
      manager?.getRepository(PreferenceEntity) ?? this.preferenceRepository
    );
  }

  private createPreferenceEntity(
    userId: number,
    preference: DefaultPreference,
    preferenceRepository: Repository<PreferenceEntity>,
  ): PreferenceEntity {
    return preferenceRepository.create({
      userId,
      notificationType: preference.notificationType,
      channel: preference.channel,
      isEnabled: preference.isEnabled,
    });
  }

  private async assertUserExists(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} was not found`);
    }
  }
}
