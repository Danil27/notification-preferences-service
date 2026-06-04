import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Region } from '../common/enums';
import { PreferencesService } from '../preferences/preferences.service';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

type UserRepositoryMock = {
  findOne: jest.Mock;
  save: jest.Mock;
  manager: {
    transaction: jest.Mock;
  };
};

type PreferencesServiceMock = {
  createDefaultPreferences: jest.Mock;
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepositoryMock;
  let preferencesService: PreferencesServiceMock;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };
    preferencesService = {
      createDefaultPreferences: jest.fn(),
    };

    service = new UserService(
      userRepository as unknown as Repository<UserEntity>,
      preferencesService as unknown as PreferencesService,
    );
  });

  it('creates user and default preferences in transaction', async () => {
    const savedUser = {
      id: 1,
      externalId: 'user-1',
      region: Region.US,
    } as UserEntity;
    const manager = {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue(savedUser),
        save: jest.fn().mockResolvedValue(savedUser),
      }),
    };

    userRepository.findOne.mockResolvedValue(null);
    userRepository.manager.transaction.mockImplementation(
      (callback: (entityManager: EntityManager) => Promise<UserEntity>) =>
        callback(manager as unknown as EntityManager),
    );

    await expect(
      service.create({
        externalId: 'user-1',
        region: Region.US,
      }),
    ).resolves.toEqual(savedUser);
    expect(preferencesService.createDefaultPreferences).toHaveBeenCalledWith(
      1,
      manager,
    );
  });

  it('throws conflict when externalId already exists', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 1,
    });

    await expect(
      service.create({
        externalId: 'user-1',
        region: Region.EU,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found for missing user id', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
