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
  ApiBody,
  ApiConsumes,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PreferenceEntity } from '../preferences/entities/preference.entity';
import { PreferencesService } from '../preferences/preferences.service';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly preferencesService: PreferencesService,
  ) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserEntity })
  @ApiConflictResponse({
    description: 'User with this externalId already exists',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User was not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiConflictResponse({
    description: 'User with this externalId already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({ description: 'User was deleted' })
  @ApiNotFoundResponse({ description: 'User was not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get(':id/preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiOkResponse({ type: PreferenceEntity, isArray: true })
  @ApiNotFoundResponse({ description: 'User was not found' })
  findPreferences(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PreferenceEntity[]> {
    return this.preferencesService.findByUserId(id);
  }

  @Post(':id/preferences')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: UpdateUserPreferenceDto })
  @ApiOperation({ summary: 'Set user preference' })
  @ApiOkResponse({ type: PreferenceEntity })
  @ApiNotFoundResponse({ description: 'User was not found' })
  updatePreference(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<PreferenceEntity> {
    return this.preferencesService.setUserPreference(
      id,
      updateUserPreferenceDto,
    );
  }
}
