import { NotificationChannel, NotificationType } from '../enums';

export interface DefaultPreference {
  notificationType: NotificationType;
  channel: NotificationChannel;
  isEnabled: boolean;
}
