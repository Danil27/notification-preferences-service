import {
  ConflictException,
  Injectable,
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

    return this.globalPolicyRepository.save(
      this.globalPolicyRepository.create({
        ...createGlobalPolicyDto,
        isActive: createGlobalPolicyDto.isActive ?? true,
      }),
    );
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

    return this.globalPolicyRepository.save(policy);
  }

  async remove(id: number): Promise<void> {
    const result = await this.globalPolicyRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Global policy with id ${id} was not found`);
    }
  }

  async findActivePolicy(
    input: FindActiveGlobalPolicyQuery,
  ): Promise<ActiveGlobalPolicyResult | null> {
    return this.globalPolicyRepository.findOne({
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
      throw new ConflictException(
        'Global policy for this notificationType, channel and region already exists',
      );
    }
  }
}
