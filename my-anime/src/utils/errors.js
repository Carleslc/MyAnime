import { Notify } from 'quasar';
import { i18n } from '@/boot/i18n';

export function notifyError(message) {
  if (message instanceof Error) {
    console.error(message.message);
    message = undefined;
  }
  Notify.create({
    type: 'negative',
    timeout: 5000,
    message: message || i18n.t('error'),
  });
}
