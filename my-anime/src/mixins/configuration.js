import { MyAnimeList, Crunchyroll } from '@/model/providers';
import { mapMutations } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export const providers = Object.freeze([
  { label: 'MyAnimeList', value: MyAnimeList },
  { label: 'Crunchyroll', value: Crunchyroll },
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

export const config = Object.freeze({
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

export const defaults = {
  username: '',
  status: 'watching',
  provider: providers[0],
  airingStatusFilter: config.airingStatuses.slice(),
  typeFilter: config.animeTypes.slice(),
};

export default {
  data() {
    return {
      config,
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

          if (key === 'provider') {
            // retrieve provider object from the saved label
            value = providers.find((provider) => provider.label === value);
          }

          if (value !== undefined && value !== null) {
            this[key] = value;
          }
        }
      });
    }

    // add watchers to save configuration
    Object.keys(defaults)
      .filter((key) => key !== 'provider') // avoid saving entire object
      .forEach((key) => this.$watch(key, (value) => this.$q.localStorage.set(key, value)));
  },
  methods: {
    ...mapMutations('store', ['set']),
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
