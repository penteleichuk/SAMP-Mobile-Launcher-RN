import { PACKAGE_NAME, PROJECT_NAME } from '@env';
import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppThunk } from '../store/store';

export const appRegisterDeviceForRemoteMessages = (): AppThunk => async () => {
  await notifee.requestPermission();
  await messaging().registerDeviceForRemoteMessages();

  if (Platform.OS === 'android') {
    return await notifee.createChannel({
      id: PACKAGE_NAME + '-default',
      name: PROJECT_NAME + ' Chanel',
      importance: AndroidImportance.HIGH,
    });
  }
};

export const createPushNotificationLoader = (): AppThunk => async dispatch => {
  dispatch(onUploadTaskEventLoader({ status: 'cancel' }));

  if (Platform.OS === 'android') {
    return await notifee.createChannel({
      id: PACKAGE_NAME + '-notification',
      name: PROJECT_NAME + ' Chanel',
    });
  }
};

export const onUploadTaskEventLoader =
  (event: any): AppThunk =>
  async () => {
    if (event.status === 'download') {
      const notification: any = {
        id: PACKAGE_NAME + '-notification',
        body: `${event.file} [${event.sizeFile} из ${event.currentFile}]`,
        title: 'Загрузка файлов игры...',
      };

      if (Platform.OS === 'android') {
        notification.android = {
          channelId: PACKAGE_NAME + '-notification',
          ongoing: true,
          onlyAlertOnce: true,
          showTimestamp: true,
          colorized: true,
          progress: {
            max: event.current,
            current: event.size,
          },
        };
      }

      await notifee.displayNotification(notification);
    }

    if (event.status === 'complete') {
      const notification: any = {
        id: PACKAGE_NAME + '-notification',
        body: ' ',
        title: 'Загрузка файлов завершена',
      };

      if (Platform.OS === 'android') {
        notification.android = {
          channelId: PACKAGE_NAME + '-notification',
          ongoing: true,
          onlyAlertOnce: false,
          showTimestamp: true,
          colorized: true,
          progress: {
            max: 100,
            current: 100,
          },
        };
      }

      await notifee.displayNotification(notification);
    }

    if (event.status === 'cancel') {
      await notifee.cancelNotification(PACKAGE_NAME + '-notification');
    }
  };
