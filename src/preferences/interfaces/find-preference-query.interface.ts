import { NotificationChannel, NotificationType } from '../enums';

export interface FindPreferenceQuery {
  userId: number;
  notificationType: NotificationType;
  channel: NotificationChannel;
}
