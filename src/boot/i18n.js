import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from 'src/i18n';
import { LocalStorage, Quasar } from 'quasar';

const languages = {
  en: '🇬🇧',
  es: '🇪🇸',
};

Vue.use(VueI18n);

function getLocale() {
  const language = LocalStorage.getItem('language');
  if (language && Object.keys(languages).includes(language)) {
    return language;
  }
  return Quasar.lang.getLocale().split('-')[0];
}

const i18n = new VueI18n({
  locale: getLocale(),
  fallbackLocale: 'en',
  messages,
});

export default ({ app }) => {
  app.i18n = i18n;
};

export { i18n };

export function getLanguageIcon(language) {
  return languages[language];
}
