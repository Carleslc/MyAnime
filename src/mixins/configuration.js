import MyAnimeList from '@/model/providers/MyAnimeList';
import Crunchyroll from '@/model/providers/Crunchyroll';
import Netflix from '@/model/providers/Netflix';
import AnimeID from '@/model/providers/AnimeID';
import AnimeFLV from '@/model/providers/AnimeFLV';
import jkAnime from '@/model/providers/jkAnime';
import MonosChinos from '@/model/providers/MonosChinos';
import AnimeFenix from '@/model/providers/AnimeFenix';
import AnimeMovil2 from '@/model/providers/AnimeMovil2';
import Twist from '@/model/providers/Twist';
import Gogoanime from '@/model/providers/Gogoanime';
import { FeelingDuckyES, FeelingDuckyEN, FeelingLuckyES, FeelingLuckyEN } from '@/model/providers/FeelingLucky';

import { i18n } from '@/boot/i18n';
import { mapFields } from 'vuex-map-fields';

export const providers = Object.freeze([
  { label: 'MyAnimeList', value: MyAnimeList },
  { label: 'Crunchyroll', value: Crunchyroll },
  { label: 'Netflix', value: Netflix },
  { label: 'Voy a tener suerte', value: FeelingDuckyES },
  { label: 'Google', value: FeelingLuckyES },
  { label: 'AnimeFLV', value: AnimeFLV },
  { label: 'AnimeFenix', value: AnimeFenix },
  { label: 'AnimeID', value: AnimeID },
  { label: 'jkanime', value: jkAnime },
  { label: 'MonosChinos', value: MonosChinos },
  { label: 'AnimeMovil', value: AnimeMovil2 },
  { label: "I'm feeling ducky", value: FeelingDuckyEN },
  { label: 'Google', value: FeelingLuckyEN },
  { label: 'Gogoanime', value: Gogoanime },
  { label: 'Twist', value: Twist },
]);

function newConfig() {
  return Object.freeze({
    airingStatuses: [
      { label: i18n.t('alreadyAired'), value: 'already-aired' },
      { label: i18n.t('notYetAired'), value: 'not-yet-aired' },
    ],
    animeTypes: [
      { label: 'TV', value: 'tv' },
      { label: 'OVA', value: 'ova' },
      { label: i18n.t('movie'), value: 'movie' },
      { label: i18n.t('special'), value: 'special' },
      { label: 'ONA', value: 'ona' },
      { label: i18n.t('music'), value: 'music' },
    ],
    statuses: {
      watching: {
        label: i18n.t('status.watching'),
        icon: 'visibility',
      },
      'on-hold': {
        label: i18n.t('status.onHold'),
        icon: 'pause',
      },
      'plan-to-watch': {
        label: i18n.t('status.planToWatch'),
        icon: 'watch_later',
      },
    },
  });
}

const defaultConfig = newConfig();

export const defaults = {
  language: i18n.locale,
  username: '',
  status: 'watching',
  provider: providers[0],
  providersByAnimeTitle: {},
  airingStatusFilter: defaultConfig.airingStatuses.map((status) => status.value),
  typeFilter: defaultConfig.animeTypes.map((type) => type.value),
};

export default {
  data() {
    return {
      config: defaultConfig,
      isRecurringUser: !this.$q.localStorage.isEmpty(),
    };
  },
  computed: {
    ...mapFields('store', Object.keys(defaults)),
  },
  created() {
    // restore saved configuration
    if (!this.isRecurrentUser) {
      Object.keys(defaults).forEach((key) => {
        if (this.$q.localStorage.has(key)) {
          let value = this.$q.localStorage.getItem(key);

          const getProvider = (label) => providers.find((provider) => provider.label === label);

          // convert provider labels to provider objects
          if (key === 'provider') {
            value = getProvider(value);
          } else if (key === 'providersByAnimeTitle') {
            const providersByAnimeTitle = {};
            Object.entries(value).forEach(([title, providerLabel]) => {
              providersByAnimeTitle[title] = getProvider(providerLabel);
            });
            value = providersByAnimeTitle;
          }

          if (value !== undefined && value !== null) {
            this[key] = value;
          }
        }
      });
    }

    // add watchers to save configuration
    Object.keys(defaults)
      .filter((key) => key !== 'provider' && key !== 'providersByAnimeTitle') // avoid saving entire objects
      .forEach((key) => this.$watch(key, (value) => this.$q.localStorage.set(key, value)));
  },
  watch: {
    // save provider label only
    provider(provider) {
      this.$q.localStorage.set('provider', provider.label);
    },
    providersByAnimeTitle: {
      handler(providersByAnimeTitle) {
        const saveProviders = {};
        Object.entries(providersByAnimeTitle).forEach(([title, provider]) => {
          saveProviders[title] = provider.label;
        });
        this.$q.localStorage.set('providersByAnimeTitle', saveProviders);
      },
      deep: true,
    },
    language(locale) {
      if (i18n.locale !== locale) {
        i18n.locale = locale;
        this.$q.lang.set(locale);
        this.config = newConfig();
      }
    },
  },
};
