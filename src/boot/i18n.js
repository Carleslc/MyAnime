import messages from 'src/i18n';
import { LocalStorage, Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';

const languages = {
  en: '🇬🇧',
  es: '🇪🇸',
};

function getLocale() {
  const language = LocalStorage.getItem('language');
  if (language && Object.keys(languages).includes(language)) {
    return language;
  }
  return Quasar.lang.getLocale().split('-')[0];
}

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  legacy: true,
  messages,
});

i18n.t = i18n.global.t;

export default ({ app }) => {
  app.use(i18n);
};

export { i18n };

export function getLanguageIcon(language) {
  return languages[language];
}
