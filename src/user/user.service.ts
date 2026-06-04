import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferencesService } from '../preferences/preferences.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly preferencesService: PreferencesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.assertExternalIdIsAvailable(createUserDto.externalId);

    return this.userRepository.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(UserEntity);
      const user = userRepository.create({
        externalId: createUserDto.externalId,
        region: createUserDto.region,
      });
      const savedUser = await userRepository.save(user);

      await this.preferencesService.createDefaultPreferences(
        savedUser.id,
        manager,
      );

      this.logger.log(
        `User created: id=${savedUser.id}, externalId=${savedUser.externalId}, region=${savedUser.region}`,
      );

      return savedUser;
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (updateUserDto.externalId !== undefined) {
      user.externalId = updateUserDto.externalId;
    }

    if (updateUserDto.region !== undefined) {
      user.region = updateUserDto.region;
    }

    const savedUser = await this.saveUser(user);

    this.logger.log(
      `User updated: id=${savedUser.id}, externalId=${savedUser.externalId}, region=${savedUser.region}`,
    );

    return savedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    this.logger.log(`User removed: id=${id}`);
  }

  private async saveUser(user: UserEntity): Promise<UserEntity> {
    await this.assertExternalIdIsAvailable(user.externalId, user.id);

    return this.userRepository.save(user);
  }

  private async assertExternalIdIsAvailable(
    externalId: string,
    ignoredUserId?: number,
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: {
        externalId,
      },
    });

    if (existingUser && existingUser.id !== ignoredUserId) {
      this.logger.warn(
        `User externalId conflict: externalId=${externalId}, existingUserId=${existingUser.id}`,
      );

      throw new ConflictException('User with this externalId already exists');
    }
  }
}
