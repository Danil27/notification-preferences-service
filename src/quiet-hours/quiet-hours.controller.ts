import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpsertQuietHoursDto } from './dto/upsert-quiet-hours.dto';
import { QuietHoursEntity } from './entities/quiet-hours.entity';
import { QuietHoursService } from './quiet-hours.service';

@ApiTags('quiet-hours')
@Controller('quiet-hours/:userId')
export class QuietHoursController {
  constructor(private readonly quietHoursService: QuietHoursService) {}

  @Get()
  @ApiOperation({ summary: 'Get user quiet hours' })
  @ApiOkResponse({ type: QuietHoursEntity })
  @ApiNotFoundResponse({ description: 'User or quiet hours were not found' })
  findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<QuietHoursEntity> {
    return this.quietHoursService.findByUserId(userId);
  }

  @Put()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: UpsertQuietHoursDto })
  @ApiOperation({ summary: 'Create or update user quiet hours' })
  @ApiOkResponse({ type: QuietHoursEntity })
  @ApiNotFoundResponse({ description: 'User was not found' })
  upsert(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() upsertQuietHoursDto: UpsertQuietHoursDto,
  ): Promise<QuietHoursEntity> {
    return this.quietHoursService.upsert(userId, upsertQuietHoursDto);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user quiet hours' })
  @ApiNoContentResponse({ description: 'Quiet hours were deleted' })
  @ApiNotFoundResponse({ description: 'User or quiet hours were not found' })
  remove(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this.quietHoursService.remove(userId);
  }
}
