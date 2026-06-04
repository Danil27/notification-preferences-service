import { NotificationChannel, NotificationType } from '../enums';

export interface SetPreferenceCommand {
  notificationType: NotificationType;
  channel: NotificationChannel;
  isEnabled: boolean;
}
