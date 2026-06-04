import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DEFAULT_USER_PREFERENCES } from './default-preferences';
import { PreferenceEntity } from './entities/preference.entity';
import {
  DefaultPreference,
  FindPreferenceQuery,
  SetPreferenceCommand,
} from './interfaces';

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

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

    const savedPreferences =
      await preferenceRepository.save(defaultPreferences);

    this.logger.log(
      `Default preferences created: userId=${userId}, count=${savedPreferences.length}`,
    );

    return savedPreferences;
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

  async findOneByUserAndNotification(
    input: FindPreferenceQuery,
  ): Promise<PreferenceEntity | null> {
    return this.preferenceRepository.findOne({
      where: {
        userId: input.userId,
        notificationType: input.notificationType,
        channel: input.channel,
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
        this.logger.debug(
          `Preference unchanged: userId=${userId}, notificationType=${command.notificationType}, channel=${command.channel}, isEnabled=${command.isEnabled}`,
        );

        return preference;
      }

      preference.isEnabled = command.isEnabled;
      const savedPreference = await this.preferenceRepository.save(preference);

      this.logger.log(
        `Preference updated: userId=${userId}, notificationType=${command.notificationType}, channel=${command.channel}, isEnabled=${command.isEnabled}`,
      );

      return savedPreference;
    }

    const savedPreference = await this.preferenceRepository.save(
      this.preferenceRepository.create({
        userId,
        notificationType: command.notificationType,
        channel: command.channel,
        isEnabled: command.isEnabled,
      }),
    );

    this.logger.log(
      `Preference created: userId=${userId}, notificationType=${command.notificationType}, channel=${command.channel}, isEnabled=${command.isEnabled}`,
    );

    return savedPreference;
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
