import { MyAnimeList } from '@/model/providers/MyAnimeList';
import { Crunchyroll } from '@/model/providers/Crunchyroll';

export const providers = Object.freeze([
  { label: 'MyAnimeList', value: new MyAnimeList() },
  { label: 'Crunchyroll', value: new Crunchyroll() },
  { label: 'Netflix', value: { url: 'https://www.netflix.com/' } },
  { label: 'Voy a tener suerte', value: { url: 'https://duckduckgo.com/' } },
  { label: 'Google (ES)', value: { url: 'https://www.google.es/' } },
  { label: 'AnimeID', value: { url: 'https://www.animeid.tv/' } },
  { label: 'AnimeFLV', value: { url: 'https://animeflv.net/' } },
  { label: 'jkanime', value: { url: 'http://jkanime.net/' } },
  { label: 'MonosChinos', value: { url: 'https://monoschinos.com/' } },
  { label: 'AnimeFenix', value: { url: 'https://animefenix.com/' } },
  { label: "I'm feeling lucky", value: { url: 'https://duckduckgo.com/' } },
  { label: 'Google (EN)', value: { url: 'https://www.google.com/' } },
  { label: 'Twist', value: { url: 'https://twist.moe/' } },
  { label: 'Gogoanime', value: { url: 'https://www.gogoanime.pro/' } },
]);

const config = Object.freeze({
  airingStatuses: ['Already aired', 'Not yet aired'],
  animeTypes: ['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music'],
  statuses: {
    watching: {
      label: 'Watching',
      icon: 'visibility',
    },
    'on-hold': {
      label: 'On Hold',
      icon: 'pause',
    },
    'plan-to-watch': {
      label: 'Plan to Watch',
      icon: 'watch_later',
    },
  },
});

const defaults = {
  username: '',
  provider: providers[0],
  airingStatusFilter: config.airingStatuses.slice(),
  typeFilter: config.animeTypes.slice(),
  status: 'watching',
};

export default {
  data() {
    const data = {
      config,
      ...defaults,
    };

    this.isRecurringUser = !this.$q.localStorage.isEmpty();

    if (!this.isRecurrentUser) {
      // restore saved configuration
      Object.keys(defaults).forEach((key) => {
        if (this.$q.localStorage.has(key)) {
          let value = this.$q.localStorage.getItem(key);

          if (key === 'provider') {
            // retrieve provider object from the saved label
            value = providers.find((provider) => provider.label === value);
          }

          if (value !== undefined && value !== null) {
            data[key] = value;
          }
        }
      });
    }

    return data;
  },
  created() {
    // add watchers to save configuration
    Object.keys(defaults)
      .filter((key) => key !== 'provider') // avoid saving entire object
      .forEach((key) => this.$watch(key, (value) => this.$q.localStorage.set(key, value)));
  },
  methods: {
    // reset configuration
    reset() {
      this.$q.localStorage.clear();
      Object.entries(defaults).forEach(([key, defaultValue]) => {
        this[key] = defaultValue;
      });
    },
  },
  watch: {
    // save provider label only
    provider(provider) {
      this.$q.localStorage.set('provider', provider.label);
    },
  },
};
