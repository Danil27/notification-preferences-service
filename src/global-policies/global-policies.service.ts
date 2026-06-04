import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../common/enums';
import { NotificationChannel, NotificationType } from '../preferences/enums';
import { CreateGlobalPolicyDto } from './dto/create-global-policy.dto';
import { UpdateGlobalPolicyDto } from './dto/update-global-policy.dto';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import {
  ActiveGlobalPolicyResult,
  FindActiveGlobalPolicyQuery,
} from './interfaces';

@Injectable()
export class GlobalPoliciesService {
  private readonly logger = new Logger(GlobalPoliciesService.name);

  constructor(
    @InjectRepository(GlobalPolicyEntity)
    private readonly globalPolicyRepository: Repository<GlobalPolicyEntity>,
  ) {}

  async create(
    createGlobalPolicyDto: CreateGlobalPolicyDto,
  ): Promise<GlobalPolicyEntity> {
    await this.assertPolicyKeyIsAvailable(
      createGlobalPolicyDto.notificationType,
      createGlobalPolicyDto.channel,
      createGlobalPolicyDto.region,
    );

    const savedPolicy = await this.globalPolicyRepository.save(
      this.globalPolicyRepository.create({
        ...createGlobalPolicyDto,
        isActive: createGlobalPolicyDto.isActive ?? true,
      }),
    );

    this.logger.log(
      `Global policy created: id=${savedPolicy.id}, notificationType=${savedPolicy.notificationType}, channel=${savedPolicy.channel}, region=${savedPolicy.region}, decision=${savedPolicy.decision}, isActive=${savedPolicy.isActive}`,
    );

    return savedPolicy;
  }

  async findAll(): Promise<GlobalPolicyEntity[]> {
    return this.globalPolicyRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<GlobalPolicyEntity> {
    const policy = await this.globalPolicyRepository.findOne({
      where: {
        id,
      },
    });

    if (!policy) {
      throw new NotFoundException(`Global policy with id ${id} was not found`);
    }

    return policy;
  }

  async update(
    id: number,
    updateGlobalPolicyDto: UpdateGlobalPolicyDto,
  ): Promise<GlobalPolicyEntity> {
    const policy = await this.findOne(id);
    const notificationType =
      updateGlobalPolicyDto.notificationType ?? policy.notificationType;
    const channel = updateGlobalPolicyDto.channel ?? policy.channel;
    const region = updateGlobalPolicyDto.region ?? policy.region;

    await this.assertPolicyKeyIsAvailable(
      notificationType,
      channel,
      region,
      id,
    );

    this.globalPolicyRepository.merge(policy, updateGlobalPolicyDto);

    const savedPolicy = await this.globalPolicyRepository.save(policy);

    this.logger.log(
      `Global policy updated: id=${savedPolicy.id}, notificationType=${savedPolicy.notificationType}, channel=${savedPolicy.channel}, region=${savedPolicy.region}, decision=${savedPolicy.decision}, isActive=${savedPolicy.isActive}`,
    );

    return savedPolicy;
  }

  async remove(id: number): Promise<void> {
    const result = await this.globalPolicyRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Global policy with id ${id} was not found`);
    }

    this.logger.log(`Global policy removed: id=${id}`);
  }

  async findActivePolicy(
    input: FindActiveGlobalPolicyQuery,
  ): Promise<ActiveGlobalPolicyResult | null> {
    const activePolicy = await this.globalPolicyRepository.findOne({
      select: {
        decision: true,
        reason: true,
      },
      where: {
        notificationType: input.notificationType,
        channel: input.channel,
        region: input.region,
        isActive: true,
      },
    });

    if (activePolicy) {
      this.logger.debug(
        `Active global policy found: notificationType=${input.notificationType}, channel=${input.channel}, region=${input.region}, decision=${activePolicy.decision}, reason=${activePolicy.reason}`,
      );
    }

    return activePolicy;
  }

  private async assertPolicyKeyIsAvailable(
    notificationType: NotificationType,
    channel: NotificationChannel,
    region: Region,
    ignoredPolicyId?: number,
  ): Promise<void> {
    const existingPolicy = await this.globalPolicyRepository.findOne({
      where: {
        notificationType,
        channel,
        region,
      },
    });

    if (existingPolicy && existingPolicy.id !== ignoredPolicyId) {
      this.logger.warn(
        `Global policy conflict: notificationType=${notificationType}, channel=${channel}, region=${region}, existingPolicyId=${existingPolicy.id}`,
      );

      throw new ConflictException(
        'Global policy for this notificationType, channel and region already exists',
      );
    }
  }
}
