import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { QuietHoursEntity } from './entities/quiet-hours.entity';
import { QuietHoursService } from './quiet-hours.service';

type QuietHoursRepositoryMock = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

type UserRepositoryMock = {
  findOne: jest.Mock;
};

describe('QuietHoursService', () => {
  let service: QuietHoursService;
  let quietHoursRepository: QuietHoursRepositoryMock;
  let userRepository: UserRepositoryMock;

  beforeEach(() => {
    quietHoursRepository = {
      findOne: jest.fn(),
      create: jest.fn((payload: QuietHoursEntity) => payload),
      save: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
    };

    service = new QuietHoursService(
      quietHoursRepository as unknown as Repository<QuietHoursEntity>,
      userRepository as unknown as Repository<UserEntity>,
    );
  });

  it('creates quiet hours with normalized time and enabled default', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 1,
    });
    quietHoursRepository.findOne.mockResolvedValue(null);
    quietHoursRepository.save.mockImplementation((entity: QuietHoursEntity) =>
      Promise.resolve(entity),
    );

    await expect(
      service.upsert(1, {
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'UTC',
      }),
    ).resolves.toMatchObject({
      userId: 1,
      startTime: '22:00:00',
      endTime: '08:00:00',
      isEnabled: true,
    });
  });

  it('throws bad request for invalid timezone', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 1,
    });

    await expect(
      service.upsert(1, {
        startTime: '22:00',
        endTime: '08:00',
        timezone: 'Wrong/Timezone',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws not found when quiet hours do not exist', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 1,
    });
    quietHoursRepository.findOne.mockResolvedValue(null);

    await expect(service.findByUserId(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
