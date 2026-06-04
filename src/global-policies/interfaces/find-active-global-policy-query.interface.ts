import { Region } from '../../common/enums';
import { NotificationChannel, NotificationType } from '../../preferences/enums';

export interface FindActiveGlobalPolicyQuery {
  notificationType: NotificationType;
  channel: NotificationChannel;
  region: Region;
}
