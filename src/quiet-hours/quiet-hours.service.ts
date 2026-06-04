import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UpsertQuietHoursDto } from './dto/upsert-quiet-hours.dto';
import { QuietHoursEntity } from './entities/quiet-hours.entity';

@Injectable()
export class QuietHoursService {
  private readonly logger = new Logger(QuietHoursService.name);

  constructor(
    @InjectRepository(QuietHoursEntity)
    private readonly quietHoursRepository: Repository<QuietHoursEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByUserId(userId: number): Promise<QuietHoursEntity> {
    await this.assertUserExists(userId);

    const quietHours = await this.quietHoursRepository.findOne({
      where: {
        userId,
      },
    });

    if (!quietHours) {
      throw new NotFoundException(
        `Quiet hours for user with id ${userId} were not found`,
      );
    }

    return quietHours;
  }

  async findOptionalByUserId(userId: number): Promise<QuietHoursEntity | null> {
    return this.quietHoursRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async upsert(
    userId: number,
    upsertQuietHoursDto: UpsertQuietHoursDto,
  ): Promise<QuietHoursEntity> {
    await this.assertUserExists(userId);
    this.assertValidTimezone(upsertQuietHoursDto.timezone);

    const quietHours = await this.quietHoursRepository.findOne({
      where: {
        userId,
      },
    });
    const payload = {
      startTime: this.normalizeTime(upsertQuietHoursDto.startTime),
      endTime: this.normalizeTime(upsertQuietHoursDto.endTime),
      timezone: upsertQuietHoursDto.timezone,
      isEnabled: upsertQuietHoursDto.isEnabled ?? true,
    };

    if (quietHours) {
      this.quietHoursRepository.merge(quietHours, payload);
      const savedQuietHours = await this.quietHoursRepository.save(quietHours);

      this.logger.log(
        `Quiet hours updated: userId=${userId}, startTime=${payload.startTime}, endTime=${payload.endTime}, timezone=${payload.timezone}, isEnabled=${payload.isEnabled}`,
      );

      return savedQuietHours;
    }

    const savedQuietHours = await this.quietHoursRepository.save(
      this.quietHoursRepository.create({
        userId,
        ...payload,
      }),
    );

    this.logger.log(
      `Quiet hours created: userId=${userId}, startTime=${payload.startTime}, endTime=${payload.endTime}, timezone=${payload.timezone}, isEnabled=${payload.isEnabled}`,
    );

    return savedQuietHours;
  }

  async remove(userId: number): Promise<void> {
    await this.assertUserExists(userId);

    const result = await this.quietHoursRepository.delete({
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException(
        `Quiet hours for user with id ${userId} were not found`,
      );
    }

    this.logger.log(`Quiet hours removed: userId=${userId}`);
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

  private assertValidTimezone(timezone: string): void {
    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
      });
    } catch {
      this.logger.warn(`Invalid timezone received: timezone=${timezone}`);

      throw new BadRequestException(`Timezone ${timezone} is not valid`);
    }
  }

  private normalizeTime(time: string): string {
    return `${time}:00`;
  }
}
