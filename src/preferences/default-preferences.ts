import { NotificationChannel, NotificationType } from './enums';
import { DefaultPreference } from './interfaces';

/**
 * Дефолтные настройки пользователя.
 * Наверное есть смысл вынести их в отдельную таблицу и сделать отдельные CRUD для их редактирования.
 * Сделал хардкодом тк это тестовое задание.
 */
export const DEFAULT_USER_PREFERENCES: DefaultPreference[] = [
  {
    notificationType: NotificationType.TRANSACTIONAL_EMAIL,
    channel: NotificationChannel.EMAIL,
    isEnabled: true,
  },
  {
    notificationType: NotificationType.MARKETING_EMAIL,
    channel: NotificationChannel.EMAIL,
    isEnabled: false,
  },
];
