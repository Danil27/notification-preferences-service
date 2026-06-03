import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGlobalPolicyDto } from './dto/create-global-policy.dto';
import { UpdateGlobalPolicyDto } from './dto/update-global-policy.dto';
import { GlobalPolicyEntity } from './entities/global-policy.entity';
import { GlobalPoliciesService } from './global-policies.service';

@ApiTags('global-policies')
@Controller('global-policies')
export class GlobalPoliciesController {
  constructor(private readonly globalPoliciesService: GlobalPoliciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create global policy' })
  @ApiCreatedResponse({ type: GlobalPolicyEntity })
  @ApiConflictResponse({ description: 'Global policy already exists' })
  create(
    @Body() createGlobalPolicyDto: CreateGlobalPolicyDto,
  ): Promise<GlobalPolicyEntity> {
    return this.globalPoliciesService.create(createGlobalPolicyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get global policies' })
  @ApiOkResponse({ type: GlobalPolicyEntity, isArray: true })
  findAll(): Promise<GlobalPolicyEntity[]> {
    return this.globalPoliciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get global policy by id' })
  @ApiOkResponse({ type: GlobalPolicyEntity })
  @ApiNotFoundResponse({ description: 'Global policy was not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GlobalPolicyEntity> {
    return this.globalPoliciesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update global policy' })
  @ApiOkResponse({ type: GlobalPolicyEntity })
  @ApiNotFoundResponse({ description: 'Global policy was not found' })
  @ApiConflictResponse({ description: 'Global policy already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGlobalPolicyDto: UpdateGlobalPolicyDto,
  ): Promise<GlobalPolicyEntity> {
    return this.globalPoliciesService.update(id, updateGlobalPolicyDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete global policy' })
  @ApiNoContentResponse({ description: 'Global policy was deleted' })
  @ApiNotFoundResponse({ description: 'Global policy was not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.globalPoliciesService.remove(id);
  }
}
