import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      externalId: createUserDto.externalId,
    });

    return this.saveUser(user);
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

    return this.saveUser(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
  }

  private async saveUser(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: {
        externalId: user.externalId,
      },
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictException('User with this externalId already exists');
    }

    return this.userRepository.save(user);
  }
}
