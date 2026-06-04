import { Injectable } from '@nestjs/common';
import { GlobalPoliciesService } from '../global-policies/global-policies.service';
import { GlobalPolicyDecision } from '../global-policies/enums/global-policy-decision.enum';
import { NotificationChannel, NotificationType } from '../preferences/enums';
import { PreferencesService } from '../preferences/preferences.service';
import { QuietHoursEntity } from '../quiet-hours/entities/quiet-hours.entity';
import { QuietHoursService } from '../quiet-hours/quiet-hours.service';
import { UserService } from '../user/user.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { EvaluationResultDto } from './dto/evaluation-result.dto';

const ALLOWED_REASON = 'allowed';
const BLOCKED_BY_USER_PREFERENCE_REASON = 'blocked_by_user_preference';
const BLOCKED_BY_QUIET_HOURS_REASON = 'blocked_by_quiet_hours';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly userService: UserService,
    private readonly preferencesService: PreferencesService,
    private readonly quietHoursService: QuietHoursService,
    private readonly globalPoliciesService: GlobalPoliciesService,
  ) {}

  async evaluate(input: CreateEvaluationDto): Promise<EvaluationResultDto> {
    await this.userService.findOne(input.userId);

    const activePolicy = await this.globalPoliciesService.findActivePolicy({
      notificationType: input.notificationType,
      channel: input.channel,
      region: input.region,
    });

    if (activePolicy) {
      return activePolicy;
    }

    const preference =
      await this.preferencesService.findOneByUserAndNotification({
        userId: input.userId,
        notificationType: input.notificationType,
        channel: input.channel,
      });

    if (preference?.isEnabled === false) {
      return this.deny(BLOCKED_BY_USER_PREFERENCE_REASON);
    }

    if (await this.isBlockedByQuietHours(input)) {
      return this.deny(BLOCKED_BY_QUIET_HOURS_REASON);
    }

    return {
      decision: GlobalPolicyDecision.ALLOW,
      reason: ALLOWED_REASON,
    };
  }

  private async isBlockedByQuietHours(
    input: CreateEvaluationDto,
  ): Promise<boolean> {
    if (
      input.notificationType !== NotificationType.MARKETING_PUSH ||
      input.channel !== NotificationChannel.PUSH
    ) {
      return false;
    }

    const quietHours = await this.quietHoursService.findOptionalByUserId(
      input.userId,
    );

    return Boolean(
      quietHours?.isEnabled &&
      this.isDateTimeWithinQuietHours(input.datetime, quietHours),
    );
  }

  private isDateTimeWithinQuietHours(
    datetime: string,
    quietHours: QuietHoursEntity,
  ): boolean {
    const currentMinutes = this.getMinutesInTimezone(
      datetime,
      quietHours.timezone,
    );
    const startMinutes = this.parseTimeToMinutes(quietHours.startTime);
    const endMinutes = this.parseTimeToMinutes(quietHours.endTime);

    if (startMinutes === endMinutes) {
      return true;
    }

    if (startMinutes < endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  private getMinutesInTimezone(datetime: string, timezone: string): number {
    const date = new Date(datetime);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);

    return (hour === 24 ? 0 : hour) * 60 + minute;
  }

  private parseTimeToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map(Number);

    return hour * 60 + minute;
  }

  private deny(reason: string): EvaluationResultDto {
    return {
      decision: GlobalPolicyDecision.DENY,
      reason,
    };
  }
}
